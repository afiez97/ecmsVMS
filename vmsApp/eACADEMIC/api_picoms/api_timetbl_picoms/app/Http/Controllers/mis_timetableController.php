<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_timetable;
use DB;

class mis_timetableController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $upload_jadual = '';
        if($request->hasFile('upload_jadual')){
            $file = $request->file('upload_jadual');
            $upload_jadual = time() . $file->getClientOriginalName();
            $file->move('upload_jadual', $upload_jadual);
        }

        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');
        $clg_id = $request->input('clg_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetable::create([
            'fk_acaCal' => $fk_acaCal,
            'fk_course' => $fk_course,
            'clg_id' => $clg_id,
            'upload_jadual' => $upload_jadual,
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$obj
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }

    public function register2(Request $request){

        // $dataString = "[30,2,549,nana,ADD],[33,2,2,,ADD] , [33,2,2,,ADD]";

        // // $dataString = $request->input('dataString');
        // $dataSets = explode(" , ", $dataString);

        // foreach ($dataSets as $dataSet) {
        //     // Remove square brackets and split the data set into an array

        //     $dataArray = explode(",", trim($dataSet, "[]"));

        //     // Check if the array has the expected number of elements
        //     if (count($dataArray) === 5) {

        //         foreach ($dataArray as $key => $value) {
        //     if ($value === "") {
        //         // Set default values as needed
        //         $dataArray[$key] = "default_value"; // Replace with an appropriate default
        //     }
        // }
        //         $insertData = [
        //             'fk_acaCal' => $dataArray[0],
        //             'fk_course' => $dataArray[1],
        //             'clg_id' => $dataArray[2],
        //             'upload_jadual' => '$dataArray[3]',
        //             // 'upload_jadual' => $dataArray[3],
        //             'recordstatus' => $dataArray[4],
        //         ];

        //         DB::table('mis_timetable')->insert($insertData);
        //     }
        // }
            

        // $dataStringMain = $request->input('dataString');

        $dataString = '[[30,2,549,"nana","ADD"],[33,2,2,"","ADD"],[33,2,2,"","ADD"]]';
        // $dataString = '['+$dataStringMain+']';

        $dataSets = explode("],[", trim($dataString, "[]"));

        foreach ($dataSets as $dataSet) {
            // Remove square brackets and split the data set into an array
            $dataArray = explode(",", trim($dataSet, "[]"));

            // Check if the array has the expected number of elements
            if (count($dataArray) === 5) {
                foreach ($dataArray as $key => $value) {
                    if ($value === "") {
                        // Set default values as needed
                        $dataArray[$key] = "default_value"; // Replace with an appropriate default
                    }
                }

                $insertData = [
                    'fk_acaCal' => $dataArray[0],
                    'fk_course' => $dataArray[1],
                    'clg_id' => $dataArray[2],
                    'upload_jadual' => '$dataArray[3]', // Remove single quotes
                    'recordstatus' => $dataArray[4],
                ];

                DB::table('mis_timetable')->insert($insertData);
            }
        }


        if($insertData){
            return response()->json([
                'success'=>'true',
                'message'=>'Register Success!',
                'data'=>$insertData
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    public function show($id){
        $obj = mis_timetable::where('mis_timetable.pk_id',$id) 
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->leftjoin('mis_prm_calendar','mis_prm_calendar.cal_id','=','mis_timetable.fk_acaCal')
            ->leftjoin('aca_cal_category','aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->get([
                'mis_timetable.pk_id AS timetbl_id',
                'mis_prm_calendar.cur_year AS cal_year',
                'intake_taken',
                'tmt_type',
                'clg_id',
                'fk_course',
                'upload_jadual',
                'crs_code',
                'crs_name',
                'fk_acaCal',
                'cal_cohort',
                'category',
                'cal_category'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = mis_timetable::where('mis_timetable.recordstatus','!=','DEL')
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'tmt_type',
                'crs_name',
                'upload_jadual'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
        
    }


    public function update(Request $request){
        // upload file
        $uptUpload = $request->input('exist_upload_jadual');
        if($request->hasFile('upload_jadual')){
            $fileProp = $request->file('upload_jadual');
            $uptUpload = time() . $fileProp->getClientOriginalName();
            $fileProp->move('upload_jadual', $uptUpload);
        }

        $pk_id = $request->input('pk_id');
        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetable::where('pk_id',$pk_id) -> update([
            'fk_acaCal' => $fk_acaCal,
            'fk_course' => $fk_course,
            'upload_jadual' => $uptUpload,
            'recordstatus' => $recordstatus,
        ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Update Success!',
                'data'=>$obj
            ],201);
        }
        else{
            return response()->json([
                'success'=>'false',
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    public function listByType($id){
        $obj = mis_timetable::where([['mis_timetable.recordstatus','!=','DEL'],['tmt_type','=',$id]])
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'tmt_type',
                'crs_name',
                'upload_jadual',
                'fk_course'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        } 
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }


    public function delete(Request $request){
        $id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_timetable::where([['pk_id','=',$id]])-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Hapus Gagal!",
                'data'=>''
            ],401);
        }
    }


    // list by Year
    public function tblByYear($id){
        $cur_year = str_replace("-","/",$id);

        $obj = mis_timetable::where([['mis_timetable.recordstatus','!=','DEL'],['cur_year','=',$cur_year]])
            ->leftjoin('mis_prm_course','mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'tmt_type',
                'crs_name',
                'upload_jadual',
                'fk_course',
                'cur_year',
                'crs_code',
                'intake_taken'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        } 
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
    }


    // list timetable by year & sem Academic Calendar
    public function timetblByYearSem(Request $request){
        $curyear = $request->input('cur_year');
        $year = str_replace("-","/",$curyear);
        $sem = $request->input('cal_cohort');

        $obj = mis_timetable::where([
                ['mis_timetable.recordstatus','!=','DEL'],
                ['mis_prm_calendar.cur_year',$year],
                ['mis_prm_calendar.cal_cohort',$sem],
            ])
            ->leftjoin('mis_prm_course', 'mis_prm_course.pk_id','=','mis_timetable.fk_course')
            ->leftjoin('mis_prm_calendar', 'mis_prm_calendar.cal_id','=','mis_timetable.fk_acaCal')
            ->leftjoin('aca_cal_category', 'aca_cal_category.pk_id','=','mis_prm_calendar.cal_category')
            ->get([
                'mis_timetable.pk_id AS timetblId',
                'mis_prm_calendar.cur_year AS aca_year',
                'cal_cohort',
                'upload_jadual',
                'category',
                'crs_code',
                'crs_name',
                'fk_course'
            ]);

        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"No data found",
                'data'=>''
            ],404);
        }
        
    }

    public function listData(Request $request){

        $fk_acaCal = $request->input('fk_acaCal');
        $fk_course = $request->input('fk_course');
        $clg_id = $request->input('clg_id');

        $obj = mis_timetable::where('fk_acaCal', '=', $fk_acaCal)
        ->where('clg_id', '=', $clg_id)
        ->where('fk_course', '=', $fk_course)
        ->where('recordstatus', '!=', 'DEL')
        ->get();

        $count = $obj->count();


        if($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Data Available',
                'data'=>$count
            ],201);
        }
        else{
            return response()->json([
                'success'=>'true',
                'message'=>'Data Available',
                'data'=>$count
            ],400);
        }
    }
}

// if(sizeof($obj)>0){