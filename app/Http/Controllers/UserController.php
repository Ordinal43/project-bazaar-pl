<?php

namespace App\Http\Controllers;

use App\User;
use Auth;
use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Stand;

class UserController extends Controller
{
    public function index()
        {
            return response()->json(User::with(['orders'])->get());
        }

        public function login(Request $request)
        {
            $status = 401;
            $response = ['error' => 'Unauthorised'];

            if (Auth::attempt($request->only(['email', 'password']))) {
                $status = 200;
                $user = Auth::user()->stands;
                $response = [
                    'user' => Auth::user(),
                    'token' => Auth::user()->createToken('bazaar')->accessToken,
                ];
            }

            return response()->json($response, $status);
        }
        
        //Register Customer
        public function registerCustomer(Request $request){
            $validator = Validator::make($request->all(),[
                'name' => 'required|max:50',
                'email' => 'required|unique:users',
                'password' => 'required|min:6',
                'c_password' => 'required|same:password',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }
            $data = $request->only(['name', 'role_id', 'email', 'password']);
            $data['password'] = bcrypt($data['password']);
            $data['role_id'] = 3;
            $user = User::create($data);

            return response()->json([
                'user' => $user,
                'token' => $user->createToken('bazaar')->accessToken,
            ]);
        }
        
        //Register Seller
        public function register(Request $request)
        {
            DB::transaction(function () use ($request, & $user, & $stand, &$data){
            $validator = Validator::make($request->all(), [
                'name' => 'required|max:50',
                'email' => 'required|unique:users',
                'password' => 'required|min:6',
                'c_password' => 'required|same:password',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 401);
            }
            
            
            //create user
            $data = $request->only(['name', 'email', 'password', 'role_id']);
            $data['password'] = bcrypt($data['password']);
            $data['role_id'] = 2;
            $user = User::create($data);
            //create stand
            $stand = Stand::create([
                'stand_name' => $request->input('stand_name'),
                'description' => $request->input('description'),
                'user_id' => $user->id,
                ]);
            $data = $user->stands;
            
        },3);
            return response()->json([
                'user' => $user,
                'token' => $user->createToken('bazaar')->accessToken,
            ]);
        }

        public function show(User $user)
        {
            return response()->json($user);
        }


}
