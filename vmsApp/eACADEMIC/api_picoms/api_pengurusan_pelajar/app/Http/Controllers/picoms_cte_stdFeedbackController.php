<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\picoms_cte_stdFeedback;
use Illuminate\Support\Facades\DB;


class picoms_cte_stdFeedbackController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $std_studentid = $request->input('std_studentid');
        $fk_cte_question = $request->input('fk_cte_question');


        $feedback_std = $request->input('feedback_std');
        $fk_cotDet = $request->input('fk_cotDet');
        $emp_id = $request->input('emp_id');
        $aca_session = $request->input('aca_session');
        $fk_crs = $request->input('fk_crs');
        $fk_rsb = $request->input('fk_rsb');

        $data =
        [
            'std_studentid' => $std_studentid,
            'fk_cte_question' => $fk_cte_question,
            'feedback_std' => $feedback_std,
            'fk_cotDet' => $fk_cotDet,
            'emp_id' => $emp_id,
            'aca_session' => $aca_session,
            'fk_crs' => $fk_crs,
            'fk_rsb' =>$fk_rsb,
            'recordstatus' => 'ADD'
        ]
        ;
           // Retrieve existing content
           $existingContent = picoms_cte_stdFeedback::where($data)->first();

         if ($existingContent !== null) {
            return response()->json([
                'success' => false,
                'message' => 'Duplicate content found',
                'data' => '',
            ], 400);
        }else{
            $obj = picoms_cte_stdFeedback::create($data);
    
            if($obj){      
                // nie utk tutup soalan yg ada changes lpas create baru
                // $obj = picoms_cte_stdFeedback::where('pk_cte', '!=',$obj->id)->update(['active' => 'inactive']);
                
                return response()->json([
                    'success'=>true,
                    'messages'=>'Proses Berjaya',
                    'data'=>$obj
                ],201);
            }
            else {
                return response()->json([
                    'success'=>false,
                    'messages'=>'Proses Gagal',
                    'data'=>'',
                ],401);
            }

        }
        
    }

    // public function update(Request $request){
    //     $subject = $request->input('subject');
    //     $kod_subject = $request->input('kod_subject');

    //     $data = [
    //         'subject' => $subject
    //     ];
    //     $obj = picoms_cte_stdFeedback::where('kod_subject',$kod_subject)->update($data);

    //     if($obj){          
    //         return response()->json([
    //             'success'=>true,
    //             'messages'=>'Proses Berjaya',
    //             'data'=>$obj
    //         ],202);
    //     }
    //     else {
    //         return response()->json([
    //             'success'=>false,
    //             'messages'=>'Proses Gagal',
    //             'data'=>'',
    //         ],402);
    //     }
    // }

    // public function view(Request $request){
    //     $kod_subject = $request->input('kod_subject');

    //     $obj = picoms_cte_stdFeedback::where('kod_subject',$kod_subject)->first();

    //     if($obj){          
    //         return response()->json([
    //             'success'=>true,
    //             'messages'=>'Proses Berjaya',
    //             'data'=>$obj
    //         ],200);
    //     }
    //     else {
    //         return response()->json([
    //             'success'=>false,
    //             'messages'=>'Proses Gagal',
    //             'data'=>'',
    //         ],400);
    //     }
    // }


    public function viewActiveQuestion(){
        // $kod_subject = $request->input('kod_subject');

        $obj = picoms_cte_stdFeedback::where([['recordstatus','!=', 'DEL'],['active','=', 'active']])->first();

        if($obj){          
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    // public function list(){
    //     $obj = picoms_cte_stdFeedback::where('recordstatus','!=','DEL')->orderBy('subject','ASC')->get();

    //     if($obj){          
    //         return response()->json([
    //             'success'=>true,
    //             'messages'=>'Proses Berjaya',
    //             'data'=>$obj
    //         ],200);
    //     }
    //     else {
    //         return response()->json([
    //             'success'=>false,
    //             'messages'=>'Proses Gagal',
    //             'data'=>'',
    //         ],400);
    //     }
    // }

    // public function delete(){
        
    // }





public function view_stdID_cotdet($std_id, $cotDet,$emp_id){

    $obj = picoms_cte_stdFeedback::where([['std_studentid',$std_id],['fk_cotDet',$cotDet],['emp_id',$emp_id],['recordstatus','!=','DEL']])->get();

    if($obj){          
        return response()->json([
            'success'=>true,
            'messages'=>'Proses Berjaya',
            'data'=>$obj
        ],200);
    }
    else {
        return response()->json([
            'success'=>false,
            'messages'=>'Proses Gagal',
            'data'=>'',
        ],400);
    }
}

public function view_empID_cotdet($emp_id, $cotDet){

    $obj = picoms_cte_stdFeedback::where([['emp_id',$emp_id],['fk_cotDet',$cotDet],['recordstatus','!=','DEL']])
    ->get();

    $fk_soalan = picoms_cte_stdFeedback::select(
        'picoms_cte_stdFeedback.fk_cte_question', 'picoms_cte_questions.soalan'
        )
        ->leftjoin('picoms_cte_questions', 'picoms_cte_questions.pk_cte', '=', 'picoms_cte_stdFeedback.fk_cte_question')

        ->where([['picoms_cte_stdFeedback.emp_id',$emp_id],['picoms_cte_stdFeedback.fk_cotDet',$cotDet],['picoms_cte_stdFeedback.recordstatus','!=','DEL']])
    
        ->groupBy(
        'picoms_cte_stdFeedback.fk_cte_question', 'picoms_cte_questions.soalan'
    )
    ->first();
    
    
    if($obj){          
        return response()->json([
            'success'=>true,
            'messages'=>'Proses Berjaya',
            'data'=>$obj,
            'dataSoalan'=>$fk_soalan
        ],200);
    }
    else {
        return response()->json([
            'success'=>false,
            'messages'=>'Proses Gagal',
            'data'=>'',
        ],400);
    }
}


public function studentRate($emp_id, $cCode, $acaSession){

    // Fetch the feedback data based on the given parameters
    $obj = picoms_cte_stdFeedback::where([
        ['emp_id', $emp_id],
        ['aca_session', $acaSession],
        ['fk_crs', $cCode],
        ['recordstatus', '!=', 'DEL']
    ])->get();


    // Fetch the questions related to the feedback
    $fk_soalan = picoms_cte_stdFeedback::select(
            'picoms_cte_stdFeedback.fk_cte_question', 
            'picoms_cte_questions.soalan'
        )
        ->leftJoin('picoms_cte_questions', 'picoms_cte_questions.pk_cte', '=', 'picoms_cte_stdFeedback.fk_cte_question')
        ->where([
            ['picoms_cte_stdFeedback.emp_id', $emp_id],
            // ['picoms_cte_stdFeedback.fk_cotDet', $cotDet],
            ['picoms_cte_stdFeedback.aca_session', $acaSession],
            ['picoms_cte_stdFeedback.fk_crs', $cCode],
            ['picoms_cte_stdFeedback.recordstatus', '!=', 'DEL']
        ])
        ->groupBy('picoms_cte_stdFeedback.fk_cte_question', 'picoms_cte_questions.soalan')
        ->first();

    // Check if feedback data is available and respond accordingly
    if($obj->isNotEmpty()){          
        return response()->json([
            'success' => true,
            'messages' => 'Proses Berjaya',
            'data' => $obj,
            'dataSoalan' => $fk_soalan
        ], 200);
    } else {
        return response()->json([
            'success' => false,
            'messages' => 'Proses Gagal',
            'data' => '',
        ], 400);
    }
}


public function totalStudent(Request $request)
{
    $crs_code = $request->input('crs_code');
    $aca_session = $request->input('aca_session');
    $emp_id = $request->input('emp_id');

    // $obj = picoms_cte_stdFeedback::where([['recordstatus','!=', 'DEL'],['aca_session',$aca_session],['emp_id',$emp_id],['fk_crs',$crs_code]])->get();

    $obj = picoms_cte_stdFeedback::select(
        'fk_cte_question',
        'emp_id',
        'fk_cotDet',
        'fk_crs',
        DB::raw('COUNT(*) as total')
    )
    ->where('emp_id', $emp_id)
    ->where('aca_session', $aca_session)
    ->where('fk_crs', $crs_code)
    ->where('recordstatus', '!=', 'DEL')
    ->groupBy('fk_cte_question', 'emp_id', 'fk_cotDet', 'fk_crs')
    ->first();

    // $obj = mis_std_regsubject::where([
    //     ['mis_std_regsubject.crs_code', '=', $crs_code],
    //     ['aca_session', '=', $aca_session],
    //     ['rsb_status', '=', 'Register'],
    //     ['mis_std_regsubject.recordstatus', '!=', 'DEL']
    // ])
    //     ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id', '=', 'mis_std_regsubject.crs_code')
    //     ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id', '=', 'mis_std_regsubject.aca_session')
    //     ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'mis_std_regsubject.std_studentid')
    //     ->leftjoin('mis_prm_programme', 'mis_prm_programme.pk_id', '=', 'mis_std_info.pgm_fk')
    //     ->leftjoin('mis_exam_application', 'mis_exam_application.rsb_id', '=', 'mis_std_regsubject.rsb_id')
        
    //     ->groupBy('mis_prm_course.crs_code')
    //     ->first([
    //         'mis_prm_course.crs_code AS crsCode',
    //         DB::RAW('COUNT(mis_prm_course.crs_code) AS total')
    //     ]);

    if ($obj) {
        return response()->json([
            'success' => 'true',
            'message' => 'List Success!',
            'data' => $obj
        ], 200);
    }
}





}




