<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_course;

class mis_prm_courseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request){
        $fac_id = $request->input('fac_id');
        $crs_code = $request->input('crs_code');
        $crs_name = $request->input('crs_name');
        // $crs_type = $request->input('crs_type');
        $crs_credit = $request->input('crs_credit');
        $crs_status = $request->input('crs_status');
        $counted_cgpa = $request->input('counted_cgpa');
        $recordstatus = $request->input('recordstatus');

        $crs_price_usd = 0;
        if($request->input('crs_price_usd')){
            $crs_price_usd = $request->input('crs_price_usd');
        }

        $crs_price = 0;
        if($request->input('crs_price')){
            $crs_price = $request->input('crs_price');
        }

        $obj = mis_prm_course::create(
            [
            'fac_id' => $fac_id,
            'crs_code' => $crs_code,
            'crs_name' => $crs_name,
            // 'crs_type' => $crs_type,
            'crs_credit' => $crs_credit,
            'crs_price' => $crs_price,
            'crs_price_usd' => $crs_price_usd,
            'crs_status' => $crs_status,
            'counted_cgpa' => $counted_cgpa,
            'recordstatus' => $recordstatus,
        ]
    );

        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>'Register Success!',
                'data'=>$obj
            ],201);
        }

        else{
            return response()->json([
                'success'=>false,
                'message'=>'Bad Request',
                'data'=>$obj
            ],400);
        }
    }


    public function show($id){
        $obj = mis_prm_course::where('mis_prm_course.pk_id',$id)
            -> leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_course.fac_id')
            ->first([
                'mis_prm_course.pk_id AS crs_id',
                'crs_code',
                'mis_prm_course.fac_id AS fk_fac',
                'crs_name',
                'crs_credit',
                'crs_price',
                'crs_price_usd',
                'crs_status',
                'counted_cgpa',
                'mis_prm_course.fac_id AS fk_faculty',
                'fac_name'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list(){
        $obj = mis_prm_course::where([['mis_prm_course.recordstatus','!=','DEL']])
            ->orderBy('crs_code')
            ->join('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
            ->get([
                'mis_prm_course.pk_id AS crsId',
                'crs_code',
                'fac_name',
                'crs_name',
                'crs_status'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function update(Request $request){
        $pk_id = $request->input('pk_id');
        $fac_id = $request->input('fac_id');
        $crs_name = $request->input('crs_name');
        // $crs_type = $request->input('crs_type');
        $crs_credit = $request->input('crs_credit');
        $crs_price = $request->input('crs_price');
        $crs_price_usd = $request->input('crs_price_usd');
        $crs_status = $request->input('crs_status');
        $counted_cgpa = $request->input('counted_cgpa');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_course::where('pk_id',$pk_id)-> update([
            'fac_id' => $fac_id,
            'crs_name' => $crs_name,
            // 'crs_type' => $crs_type,
            'crs_credit' => $crs_credit,
            'crs_price' => $crs_price,
            'crs_price_usd' => $crs_price_usd,
            'crs_status' => $crs_status,
            'counted_cgpa' => $counted_cgpa,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $obj
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],401);
        }
    }


    public function delete(Request $request)    {
        $pk_id = $request->input('pk_id');
        $recordstatus = $request->input('recordstatus');

        $obj = mis_prm_course::where('pk_id',$pk_id)-> update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj)  {
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

    
    public function courseCodeChecking(Request $request){
        $input = $request->input('input');

        $query = mis_prm_course::select('crs_code')->where([['crs_code','=',$input],['recordstatus','!=','DEL']]) ->get();

        if($query){
            return response()->json([
                'success'=>true,
                'message'=>"Carian Berjaya!",
                'data' => $query
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Carian Gagal!",
                'data'=>''
            ],404);
        }
    }


    // course list by campus
    public function listByCampus($id)  {
        $obj = mis_prm_course::select('mis_prm_course.*','fac_name','mis_prm_college.pk_id AS pk_clg')
            -> join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_course.fac_id')
            -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            -> where('mis_prm_college.pk_id', '=', $id)
            -> where([['mis_prm_course.recordstatus','!=','DEL']])->get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // select course list
    public function selectCrs($id){
        $obj = mis_prm_course::where([
                ['mis_prm_course.fac_id', '=', $id],
                ['mis_prm_course.crs_status', '=', 'Active'],
                ['mis_prm_course.recordstatus','!=','DEL']
            ])
            -> leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_course.fac_id')
            -> orderBy('mis_prm_course.crs_code','asc')
            ->get([
                'mis_prm_course.pk_id AS pk_crs',
                'fac_name',
                'crs_code',
                'crs_name'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }

    // select course list counted
    public function selectCrsCounted($id){
        $obj = mis_prm_course::where([
                ['mis_prm_course.pk_id', '=', $id],
                ['mis_prm_course.crs_status', '=', 'Active'],
                ['mis_prm_course.recordstatus','!=','DEL']
            ])
            // -> orderBy('mis_prm_course.crs_code','asc')
            ->first([
                'mis_prm_course.pk_id AS pk_crs',
                'crs_code',
                'crs_name',
                'counted_cgpa'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // select pre-requisite course list
    public function selectPrereqCrs(Request $request){
        $fac_id = $request->input('fac_id');
        $course_id = $request->input('course_id');

        $obj = mis_prm_course::select('mis_prm_course.*','fac_name')
            -> join('mis_prm_faculty', 'mis_prm_faculty.pk_id', '=' , 'mis_prm_course.fac_id')
            // -> join('mis_prm_college', 'mis_prm_college.pk_id', '=' , 'mis_prm_faculty.cam_id')
            // -> where()
            // -> where('mis_prm_course.crs_status', '=', 'Active')
            // -> where()
            -> where([['mis_prm_course.fac_id', '=', $fac_id],['mis_prm_course.pk_id', '!=', $course_id],['mis_prm_course.recordstatus','!=','DEL']])->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }


    // list Course active
    public function listAct(){
        $obj = mis_prm_course::where([['mis_prm_course.recordstatus','!=','DEL'],['mis_prm_course.crs_status','=','Active']])
            ->orderBy('crs_code')
            ->leftjoin('mis_prm_faculty', 'mis_prm_faculty.pk_id','=','mis_prm_course.fac_id')
            ->get([
                'mis_prm_course.pk_id AS crsId',
                'crs_code',
                'fac_name',
                'crs_name',
                'crs_status'
            ]);

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
