<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_atd_attendance;
use App\Models\mis_atd_week;
use DB;

class mis_atd_attendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // public function register(Request $request){
    //     $fk_tmtDet = $request->input('fk_tmtDet');
    //     $fk_week = $request->input('fk_week');
    //     $std_studentid = $request->input('std_studentid');
    //     $recordstatus = $request->input('recordstatus');
    //     $remark = $request->input('remark');
    //     $status_attend = $request->input('status_attend');

    //     if($status_attend != ""){
    //         $obj = mis_atd_attendance::create([
    //             'fk_tmtDet' => $fk_tmtDet,
    //             'fk_week' => $fk_week,
    //             'std_studentid' => $std_studentid,
    //             'recordstatus' => $recordstatus,
    //             'remark' => $remark,
    //             'status_attend' => $status_attend
    //         ]);
    //     }
    //     else{
    //         $obj = mis_atd_attendance::create([
    //             'fk_tmtDet' => $fk_tmtDet,
    //             'fk_week' => $fk_week,
    //             'std_studentid' => $std_studentid,
    //             'recordstatus' => $recordstatus,
    //             'remark' => $remark,
    //             // 'status_attend' => $status_attend
    //         ]);
    //     }

    //     if($obj){
    //         return response()->json([
    //             'success'=>'true',
    //             'message'=>'Register Success!',
    //             'data'=>$obj
    //         ],201);
    //     }
    //     else{
    //         return response()->json([
    //             'success'=>'false',
    //             'message'=>'Bad Request',
    //             'data'=>$obj
    //         ],400);
    //     }
    // }

    public function register(Request $request){
        $fk_tmtDet = $request->input('fk_tmtDet');
        $fk_week = $request->input('fk_week');
        $std_studentid = $request->input('std_studentid');
        $recordstatus = $request->input('recordstatus');
        $remark = $request->input('remark');
        $status_attend = $request->input('status_attend');

        $count = mis_atd_attendance::where('std_studentid', $std_studentid)
            ->where('fk_tmtDet', $fk_tmtDet)
            ->where('fk_week', $fk_week)
            ->where('recordstatus', '!=', 'DEL')
            ->count();

            // dd($count);

        if($count > 0 ){

            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>''
            ],400);
            
        }
        else{
            // dd(123);

            if($status_attend != ""){

                $obj = mis_atd_attendance::create([
                    'fk_tmtDet' => $fk_tmtDet,
                    'fk_week' => $fk_week,
                    'std_studentid' => $std_studentid,
                    'recordstatus' => $recordstatus,
                    'remark' => $remark,
                    'status_attend' => $status_attend
                ]);
            }
            else{
                $obj = mis_atd_attendance::create([
                    'fk_tmtDet' => $fk_tmtDet,
                    'fk_week' => $fk_week,
                    'std_studentid' => $std_studentid,
                    'recordstatus' => $recordstatus,
                    'remark' => $remark,
                    // 'status_attend' => $status_attend
                ]);
            }
            

            return response()->json([
                'success'=>true,
                'message'=>'Register Success!',
                'data'=>$obj
            ],201);
        }
    }

    public function update(Request $request){
        $atd_id = $request->input('atd_id');
        $recordstatus = 'EDT';
        $remark = $request->input('remark');
        $status_attend = $request->input('status_attend');

        $obj = mis_atd_attendance::where('atd_id',$atd_id)->update([
            'recordstatus' => $recordstatus,
            'remark' => $remark,
            'status_attend' => $status_attend
        ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    // find id if existed
    public function findId(Request $request){
        $fk_week = $request->input('fk_week');
        $std_studentid = $request->input('std_studentid');

        $obj = mis_atd_attendance::where([['fk_week',$fk_week],['std_studentid',$std_studentid],['recordstatus','!=','DEL']]) ->get(['atd_id']);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }

    public function summary_tmtDet(Request $request){
        $status_attend = $request->input('status_attend');
        $fk_week = $request->input('fk_week');

        $obj = mis_atd_attendance::join('mis_atd_week', 'mis_atd_week.pk_id', '=', 'mis_atd_attendance.fk_week')
        ->join('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_atd_attendance.std_studentid')
        ->where('mis_atd_week.fk_tmtDet', '=', $fk_week)
        ->where('status_attend', '=', $status_attend)
        ->groupBy('mis_atd_attendance.std_studentid', 'mis_std_info.sti_name', 'pgm_id')
        ->get([
            DB::RAW('COUNT(mis_atd_attendance.std_studentid) AS total_atd'),
            'mis_atd_attendance.std_studentid',
            'mis_std_info.sti_name',
            'pgm_id'
        ]);

        $result = mis_atd_week::where('fk_tmtDet', '=', $fk_week)
        ->groupBy('fk_tmtDet')
        ->get([
            DB::RAW('COUNT(fk_tmtDet) AS total_week')
        ]);

        if($result){
            return response()->json([
                'success'=>true,
                'message'=>'Show Success!',
                'data'=>$obj,
                'total_week'=>$result
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
            
    }
}
