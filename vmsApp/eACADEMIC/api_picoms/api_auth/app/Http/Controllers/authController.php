<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\sad_users;
use App\Models\log;
use Illuminate\Support\Facades\DB;

class authController extends Controller
{
    public function login(Request $request)
    {
        //setting log
        $ip_address = $request->getClientIp();
        $activity = "Login";

        $msgSuccess = 'Login Successful';
        $msgFailUname = 'Your username is not exist.';
        $msgFailPwd = 'Your have entered the wrong password';
        $msgFail = 'Login Failed';
        $col_search = '';

        $usr_id = $request->input('usr_id');
        $usr_passwd = $request->input('usr_passwd');
        $usr_type = $request->input('usr_type');

        $data = [
            'usr_id' => $usr_id,
            'password' => $usr_passwd,
            'usr_type' => $usr_type
        ];

        $data = json_encode($data);

        if ($usr_type == 1) {
            $cat = sad_users::where([['usr_id', '=', $usr_id], ['usr_cat_eadmin', '!=', 0]])
                ->first();

            if ($cat) {
                $col_search = 'usr_cat_eadmin';
            } else {
                $catCms = sad_users::where([['usr_id', '=', $usr_id], ['usr_cat_ecmis', '!=', 0]])->first();
                if ($catCms) {
                    $col_search = 'usr_cat_ecmis';
                } else {
                    $col_search = 'usr_cat_eadmin';
                }
            }
        } else if ($usr_type == 2) {
            $col_search = 'usr_cat_estudent';
        } else if ($usr_type == 3) {
            $col_search = 'usr_cat_ehep';
        }

        // $user = sad_users::join('adm_access','pk_id','access_id')->where([['usr_id',$usr_id]])
        $user = sad_users::leftjoin('adm_access','pk_id','access_id')->where([['usr_id',$usr_id]])
        // $user = sad_users::where([['usr_id',$usr_id]])

        // // afiez buang sni  30july2024 11.28pagi
        // ->where(function ($q) use ($usr_type,$col_search){
        //     if($usr_type == 1){
        //         $q->where($col_search,'!=',0);
        //     }else{
        //         $q->where($col_search,1);
        //     }
        // })
        // // afiez buang sni

        ->first();
        
        // dd(\DB::getQueryLog());
        // dd($col_search);

        if ($user) {
            $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
            $std_katalaluan     = hash("sha256", $usr_passwd . $salt);

            $data = [
                'usr_id' => $usr_id,
                'password' => $std_katalaluan,
                'usr_type' => $usr_type
            ];

            $data = json_encode($data);

            if ($user->usr_passwd === $std_katalaluan) {
                $token = Str::random(32);

                $users = sad_users::where('usr_id', $usr_id)->update([
                    'user_token' => $token
                ]);

                if ($users) {
                    //insert log
                    $this->logAudit([
                        'activity' => $activity,
                        'ip_address' => $ip_address,
                        'message' => $msgSuccess,
                        'datalist' => $data,
                        'statusrekod' => 200,
                    ]);

                    return response()->json([
                        'success' => true,
                        'token' => $token,
                        'messages' => $msgSuccess,
                        'data' => $users,
                        'data2' => $user,
                    ], 201);
                } else {

                    $this->logAudit([
                        'activity' => $activity,
                        'ip_address' => $ip_address,
                        'datalist' => $data,
                        'message' => $msgFail,
                        'statusrekod' => 400,
                    ]);

                    return response()->json([
                        'success' => false,
                        'token' => $token,
                        'messages' => $msgFail,
                        'data' => '',
                        'data2' => '',
                    ], 201);
                }
            } else {

                $this->logAudit([
                    'activity' => $activity,
                    'ip_address' => $ip_address,
                    'datalist' => $data,
                    'message' => $msgFailPwd,
                    'statusrekod' => 400,
                ]);

                return response()->json([
                    'success' => false,
                    // 'token'=>$token,
                    'messages' => $msgFailPwd,
                    'data' => '',
                ], 201);
            }
        } else {

            $this->logAudit([
                'activity' => $activity,
                'ip_address' => $ip_address,
                'datalist' => $data,
                'message' => $msgFailUname,
                'statusrekod' => 400,
            ]);

            return response()->json([
                'success' => false,
                // 'token'=>$token,
                'messages' => $msgFailUname,
                'data' => ''
            ], 201);
        }
    }

    public function checKingPassword(Request $request)
    {
        $usr_id = $request->input('usr_id');
        $usr_passwd = $request->input('usr_passwd');

        $user = sad_users::where([['usr_id', $usr_id]])
            ->first(
                [
                    'sad_users.usr_id',
                    'sad_users.usr_icno',
                    'sad_users.usr_name',
                    'sad_users.usr_passwd'
                ]
            );

        $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
        $std_katalaluan  = hash("sha256", $usr_passwd . $salt);


        if ($user->usr_passwd === $std_katalaluan) {
            unset($user->usr_passwd); //buang token utk user tgok

            return response()->json([
                'success' => true,
                'messages' => 'Password is Match',
                'data' => $user,
            ], 201);
        } else {

            return response()->json([
                'success' => false,
                'messages' => 'Your have entered the wrong password',
                'data' => '',
            ], 201);
        }
    }

    public function updatePassword(Request $request)
    {
        $usr_id = $request->input('usr_id');
        $usr_passwd = $request->input('new_usr_passwd');

        $data = [
            'usr_id' => $usr_id,
            'password' => $usr_passwd,
        ];

        $data = json_encode($data);


        $user = sad_users::where([['usr_id', $usr_id]])
            ->first(
                [
                    'sad_users.usr_id',
                    'sad_users.usr_icno',
                    'sad_users.usr_name',
                    'sad_users.usr_passwd'
                ]
            );

            if ($user) {

                $salt = "RMY7nZ3+s8xpU1n0O*0o_EGfdoYtd|iU_AzhKCMoSu_xhh-e|~y8FOG*-xLZ";
                $std_katalaluan_baru  = hash("sha256", $usr_passwd . $salt);
        
                if ($user->usr_passwd === $std_katalaluan_baru) {
                    return response()->json([
                        'success' => false,
                        'messages' => 'Current password already used',
                        'data' => '',
                    ], 401);
                } else {

                    $userUpdated = sad_users::where([['usr_id', $usr_id]])
                    ->update(
                        [
                            'usr_passwd' => $std_katalaluan_baru
                        ]
                    );

                    if ($userUpdated) {
                        return response()->json([
                            'success' => true,
                            'messages' => 'Success to update password user',
                            'data' => sad_users::where('usr_id', $usr_id)->first( ['sad_users.usr_id','sad_users.usr_icno','sad_users.usr_name','sad_users.usr_passwd']),
                        ], 201);
                    } else {
                        return response()->json([
                            'success' => false,
                            'messages' => 'Update Failed',
                            'data' => '',
                        ], 401);
                    }
               
                }

            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'User not found',
                    'data' => '',
                ], 401);
            }
    }

    public function getCounts()
    {
        $chgProgramT = DB::table('mis_std_chg_program')
            ->where('recordstatus', '!=', 'DEL')
            ->where('recordstatus', '!=', 'COM')
            ->count('id');

        $withdrawStatusT = DB::table('mis_std_withdraw')
            ->where('recordstatus', '!=', 'DEL')
            ->where('withdraw_status', '!=', 'Complete')
            ->count('withdraw_status');

        $CECTStatusT = DB::table('mis_std_cect')
            ->where('recordstatus', '!=', 'DEL')
            ->where('cect_status', '=', 'New')
            ->count('cect_status');

            $ReExammStatusT = DB::table('mis_exam_application')
            ->where('recordstatus', '!=', 'DEL')
            ->where('app_status', '=', 'In Progress')
            // ->where('app_status', '!=', 'Reject')
            ->count('app_status');
            
        return response()->json([
            'chgProgramT' => $chgProgramT,
            'withdrawStatusT' => $withdrawStatusT,
            'CECTStatusT' => $CECTStatusT,
            'ReExammStatusT' => $ReExammStatusT
        ]);
    }

    public function getCountsHepa()
    {
        $appliedProgrammeT = DB::table('hep_program')
            ->where('recordstatus', '!=', 'DEL')
            ->where('prog_status', '=', 'New')
            ->count('id_program');

        $disciplineTNew = DB::table('hep_discipline')
            ->where('dis_id', '!=', 'DEL')
            ->where('dis_pay_status', '=', 'New')
            ->count('dis_id');

        $counsellingTotalNew = DB::table('hep_counselling')
            ->where('recordstatus', '!=', 'DEL')
            ->where('counselling_status', '=', 'New')
            ->count('counselling_status');

            // $ReExammStatusT = DB::tass
            $complaintTotalNew = DB::table('hep_aduan')
            ->where('recordstatus', '!=', 'DEL')
            // ->where('aduan_status', '=', 'New')
            // ->where('aduan_status', '=', 'Pending')
            ->where(function($query) {
            return $query
                   ->where('aduan_status', 'New')
                   ->orWhere('aduan_status',  'Pending');
           })
            ->count('aduan_status');

            $bookingTotalNew = DB::table('hep_hostel_booking') 
            ->where('recordstatus', '!=', 'DEL')
            ->where('booking_status', '=', 'New')
            ->count('booking_status');
            
            
            $chkOutTotalNew = DB::table('hep_hostel_chkinout') 
            ->where('recordstatus', '!=', 'DEL')
            ->where('checkOut_status', '=', 'New')
            ->count('checkOut_status');  
            
            $changeTotalNew = DB::table('hep_hostel_change')
            ->where('recordstatus', '!=', 'DEL')
            ->where(function($query) {
            return $query
                   ->where('change_status', 'New')
                   ->orWhere('change_status',  'Verify');
           })
            ->count('change_status');

            $aduanTotalNew = DB::table('hep_aduanResponden') 
            ->where('recordstatus', '!=', 'DEL')
            ->where('aduan_status', '=', 'New')
            ->count('aduan_status');  
            
        return response()->json([
            'appliedProgrammeT' => $appliedProgrammeT,
            'disciplineTNew' => $disciplineTNew,
            'counsellingTotalNew' => $counsellingTotalNew,
            // 'ReExammStatusT' => $ReExammStatusT
            'complaintTotalNew' => $complaintTotalNew,
            'bookingTotalNew' => $bookingTotalNew,
            'chkOutTotalNew' => $chkOutTotalNew,
            'changeTotalNew' => $changeTotalNew,
            'aduanTotalNew' => $aduanTotalNew,
        ]);
    }


    //function log
    private function logAudit($data)
    {
        $obj = log::create($data);
    }
}
