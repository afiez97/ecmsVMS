<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\ mis_atd_policy;

class mis_atd_policyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    public function register(Request $request) {

        $register = '';
        $data = '';

        $flag = $request->input('page');
        $apl_id = 'ecms';
        $recordstatus = $request->input('recordstatus');

        $query = mis_atd_policy::all();
        $count = count($query);

        if($flag == 1){

            $apl_attendance_mode = $request->input('apl_attendance_mode');
            $apl_earlyin_dur = $request->input('apl_earlyin_dur');
            $apl_earlyout_dur = $request->input('apl_earlyout_dur');
            $apl_latein_dur = $request->input('apl_latein_dur');
            $apl_lateout_dur = $request->input('apl_lateout_dur');
            $apl_refresh_interval = $request->input('apl_refresh_interval');
            $apl_warning_status = $request->input('apl_warning_status');
            $apl_warning_letter_param = $request->input('apl_warning_letter_param');
            
            $dataC = [
                'apl_id' => $apl_id,
                'apl_attendance_mode' => $apl_attendance_mode,
                'apl_earlyin_dur' => $apl_earlyin_dur,
                'apl_earlyout_dur' => $apl_earlyout_dur,
                'apl_latein_dur' => $apl_latein_dur,
                'apl_lateout_dur' => $apl_lateout_dur,
                'apl_refresh_interval' => $apl_refresh_interval,
                'apl_warning_status' => $apl_warning_status,
                'apl_warning_letter_param' => $apl_warning_letter_param,
                // 'apl_notification' => $apl_notification,
                'recordstatus' => $recordstatus,
            ];

            $dataU = [
                'apl_attendance_mode' => $apl_attendance_mode,
                'apl_earlyin_dur' => $apl_earlyin_dur,
                'apl_earlyout_dur' => $apl_earlyout_dur,
                'apl_latein_dur' => $apl_latein_dur,
                'apl_lateout_dur' => $apl_lateout_dur,
                'apl_refresh_interval' => $apl_refresh_interval,
                'apl_warning_status' => $apl_warning_status,
                'apl_warning_letter_param' => $apl_warning_letter_param,
                // 'apl_notification' => $apl_notification,
                'recordstatus' => $recordstatus,
            ];

        }else{

            $apl_notification = $request->input('apl_notification');

            $dataC = [
                'apl_id' => $apl_id,
                'apl_notification' => $apl_notification,
                'recordstatus' => $recordstatus,
            ];

            $dataU = [
                'apl_notification' => $apl_notification,
                'recordstatus' => $recordstatus,
            ];

        }

        if($count <= 0){

            $query1 =  mis_atd_policy::create($dataC);

        }else{

            $query1 = mis_atd_policy::where([['apl_id','=','ecms']])->update($dataU);

        }

        if ($query1)  {
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$query1
            ],201);
        }

        else  {
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$query1
            ],400);
        }
    }

    public function show()  {

        $query = mis_atd_policy::where('apl_id','ecms')->get();

        if ($query)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$query
            ],200);
        }
    }

    
}
