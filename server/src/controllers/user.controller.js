import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Business } from "../models/business.model.js";
import { uploadOnCloudinary } from "../utils/coudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { response } from "express";
import { BusinessRole } from "../models/businessRole.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const businessDetails = await Business.findById(user.BusinessId)

        const accessToken = user.generateAccessToken(businessDetails);
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false});

        return {
            accessToken,
            refreshToken
        }
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get user details from client
    //validation: not empty
    //check if user already exists: username, email
    //create new user object and add to db
    //remove password and refreshtoken field from response
    //check if user is created successfully
    //send success response with user details

    const { username, firstname, lastname, email, mobileno, password, cnic } = req.body

    // console.log(username, firstname, lastname, email, mobileno, password, cnic);
    

    // if ([username, firstname, mobileno, password].some((field) => field?.trim() === "")) {
    //     throw new ApiError(400, "Required fields missing!")
    // }

    if (!username || !firstname || !mobileno || !password) {
        throw new ApiError(400, "Required fields missing!");
    }

    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (userExists) {
        throw new ApiError(409, "Username or Email already exists!")
    }

    const user = await User.create({
        username: username?.toLowerCase(),
        firstname,
        lastname,
        email,
        mobileno,
        password,
        cnic
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser) {
        throw new ApiError(500, "Failed to create user! something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

const loginUser = asyncHandler( async (req, res) => {
    // request body -> data
    // username or email 
    // find user
    // password check
    // access refresh token
    //send cookies

    try {
        const {username, password} = req.body
        // console.log({username, password});
        
    
        if (!username || !password) {  // check logic
            throw new ApiError(400, "Credentials missing username or password")
        }
    
        const user = await User.findOne({ username });
    
        if (!user) {
            throw new ApiError(404, "User does not exist") 
        }
    
        const isPasswordValid = await user.isPasswordCorrect(password);
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid Credentials")
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken").populate('BusinessId', 'businessName businessRegion businessLogo subscription gst isActive exemptedParagraph');

    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "Logged in successfully"
            )
        )
    } catch (error) {
        throw new ApiError(400, "Error in logging in user")
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    // console.log('logging out user');
    
    // User.findByIdAndUpdate(
    //     req.user._id,
    //     {
    //         $set: {
    //             refreshToken: undefined
    //         }
    //     },
    //     {
    //         new: true
    //     }
    // )
    // console.log('token cleared');
    
    const options = {
        httpOnly: true,
        secure: true
    }
    
    // console.log('sending logout response');
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User logged out successfully")
    )
})

const refreshAccessToken = asyncHandler( async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // console.log('incoming refresh token:', incomingRefreshToken);

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if( incomingRefreshToken !== user?.refreshToken ) {
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id) //refresh token -> new refresh token

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options) //refresh token: new refresh token
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken
                },
                "Access Token refreshed"
            )
        )

    } catch (error) {
        new ApiError(401, "Failed to refresh Access Token")
    }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { username, cnic, newPassword } = req.body;

    if (!username || !cnic || !newPassword) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ username, cnic });

    if (!user) {
        throw new ApiError(404, "User not found or CNIC does not match");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});



const getCurrentUser = asyncHandler(async(req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized request. User not found.");
    }



    const loggedInUser = await User.findById(user._id).select("-password -refreshToken").populate('BusinessId', 'businessName businessRegion businessLogo subscription gst isActive exemptedParagraph');

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        loggedInUser,
        "User fetched successfully"
    ))
})

const registerBusiness = asyncHandler(async (req, res) => {
    const { businessName, businessRegion, subscription, exemptedParagraph, gst } = req.body;

    if (!businessName || !businessRegion || !subscription) {
        throw new ApiError(400, "Required fields are missing");
    }

    const owner = req.user;
    if (!owner) {
        throw new ApiError(401, "Unauthorized request. User not found.");
    }

    const user = await User.findById(owner._id)

    if(user.BusinessId) {
        throw new ApiError(400, "User already has a business registered");
    }

    let logoUrl = ""; 

    if (req.file?.path) {
        try {
            const logo = await uploadOnCloudinary(req.file.path);
            if (!logo?.url) {
                throw new Error("Upload failed");
            }
            logoUrl = logo.url;
        } catch (error) {
            console.error("Error uploading logo:", error.message);
            throw new ApiError(500, "Error while uploading the logo");
        }
    }


    const business = await Business.create({
        businessName,
        businessRegion,
        subscription,
        businessLogo: logoUrl,
        exemptedParagraph: exemptedParagraph || "",
        gst: gst || "",
        isActive: true,
        owner: owner._id, 
    });

    await User.findByIdAndUpdate(
        owner?._id,
        {
            $set: {
                BusinessId: business._id
            }
        }
    )
    // console.log(user)

    if (!business) {
        throw new ApiError(500, "Failed to register business. Something went wrong.");
    }

    const registeredBusiness = await Business.findById(business._id).populate('owner', 'username email');

    return res.status(201).json(
        new ApiResponse(
            201,
            registeredBusiness,
            "Business registered successfully"
        )
    );
});

const registerRole = asyncHandler( async (req, res) => {
    const { businessRoleName } = req.body;

    if (!businessRoleName) {
        throw new ApiError(400, "Business role name is required");
    }

    const businessRoleExist = await BusinessRole.findOne({businessRoleName})

    if (businessRoleExist) {
        throw new ApiError(400, "Business role already exists");
    }

    const businessRole = await BusinessRole.create({
        businessRoleName
    });

    if (!businessRole) {
        throw new ApiError(500, "Failed to register role. Something went wrong.");
    }

    const registeredRole = await BusinessRole.findById(businessRole._id)

    return res.status(200).json(
        new ApiResponse(
            200,
            registeredRole,
            "Business role registered successfully"
        )
    );

})

// get roles

const getRoles = asyncHandler(async (req, res) => {
    const roles = await BusinessRole.find({});

    if (!roles) {
        throw new ApiError(404, "No business roles found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            roles,
            "Business roles fetched successfully"
        )
    );
})


export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    registerBusiness,
    registerRole,
    getRoles
}