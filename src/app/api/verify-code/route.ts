import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";