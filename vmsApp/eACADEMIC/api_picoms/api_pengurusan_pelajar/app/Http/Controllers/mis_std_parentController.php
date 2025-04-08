<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_parent;

class mis_std_parentController extends Controller
{
    /// public function  __construct()
    // {
    //     $this->middleware('auth');
    // }

    public function create(Request $request){

        $std_studentid               = $request->input('std_studentid');
        $pgm_id                      = $request->input('pgm_id');
        $par_father_title            = $request->input('par_father_title');
        $par_father_name             = $request->input('par_father_name');
        $par_father_icno             = $request->input('par_father_icno');
        $par_father_address          = $request->input('par_father_address');
        $par_father_contactno        = $request->input('par_father_contactno');
        $par_father_relationship     = $request->input('par_father_relationship');
        $par_father_nationality      = $request->input('par_father_nationality');
        $par_mother_title            = $request->input('par_mother_title');
        $par_mother_name             = $request->input('par_mother_name');
        $par_mother_icno             = $request->input('par_mother_icno');
        $par_mother_address          = $request->input('par_mother_address');
        $par_mother_contactno        = $request->input('par_mother_contactno');
        $par_mother_relationship     = $request->input('par_mother_relationship');
        $par_mother_nationality      = $request->input('par_mother_nationality');
        // $par_family_income           = $request->input('par_family_income');
        // $par_family_responsibility   = $request->input('par_family_responsibility');
        // $par_living_with             = $request->input('par_living_with');

        $data = [
            'std_studentid'             => $std_studentid ,
            'pgm_id'                    => $pgm_id ,
            'par_father_title'          => $par_father_title ,
            'par_father_name'           => $par_father_name ,
            'par_father_icno'           => $par_father_icno ,
            'par_father_address'        => $par_father_address,
            'par_father_contactno'      => $par_father_contactno,
            'par_father_relationship'   => $par_father_relationship,
            'par_father_nationality'    => $par_father_nationality,

            'par_mother_title'          => $par_mother_title,
            'par_mother_name'           => $par_mother_name,
            'par_mother_icno'           => $par_mother_icno,
            'par_mother_address'        => $par_mother_address,
            'par_mother_contactno'      => $par_mother_contactno,
            'par_mother_nationality'    => $par_mother_nationality,
            'par_mother_relationship'   => $par_mother_relationship,

            // 'par_family_income' => $par_family_income,
            // 'par_family_responsibility' => $par_family_responsibility,
            // 'par_living_with' => $par_living_with,
            'recordstatus' => "ADD",
        ];

        $dataP = mis_std_parent::create($data);

        if($data){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$data,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],400);
        }

    }

    public function update(Request $request){

        $std_studentid               = $request->input('std_studentid');
        $pgm_id                      = $request->input('pgm_id');
        $par_father_title            = $request->input('par_father_title');
        $par_father_name             = $request->input('par_father_name');
        $par_father_icno             = $request->input('par_father_icno');
        $par_father_address          = $request->input('par_father_address');
        $par_father_contactno        = $request->input('par_father_contactno');
        $par_father_relationship     = $request->input('par_father_relationship');
        $par_father_nationality      = $request->input('par_father_nationality');
        $par_mother_title            = $request->input('par_mother_title');
        $par_mother_name             = $request->input('par_mother_name');
        $par_mother_icno             = $request->input('par_mother_icno');
        $par_mother_address          = $request->input('par_mother_address');
        $par_mother_contactno        = $request->input('par_mother_contactno');
        $par_mother_relationship     = $request->input('par_mother_relationship');
        $par_mother_nationality      = $request->input('par_mother_nationality');
        // $par_family_income           = $request->input('par_family_income');
        // $par_family_responsibility   = $request->input('par_family_responsibility');
        // $par_living_with             = $request->input('par_living_with');

        $data = [
            'std_studentid'             => $std_studentid ,
            'pgm_id'                    => $pgm_id ,
            'par_father_title'          => $par_father_title ,
            'par_father_name'           => $par_father_name ,
            'par_father_icno'           => $par_father_icno ,
            'par_father_address'        => $par_father_address,
            'par_father_contactno'      => $par_father_contactno,
            'par_father_relationship'   => $par_father_relationship,
            'par_father_nationality'    => $par_father_nationality,

            'par_mother_title'          => $par_mother_title,
            'par_mother_name'           => $par_mother_name,
            'par_mother_icno'           => $par_mother_icno,
            'par_mother_address'        => $par_mother_address,
            'par_mother_contactno'      => $par_mother_contactno,
            'par_mother_nationality'    => $par_mother_nationality,
            'par_mother_relationship'   => $par_mother_relationship,

            // 'par_family_income' => $par_family_income,
            // 'par_family_responsibility' => $par_family_responsibility,
            // 'par_living_with' => $par_living_with,
            'recordstatus' => "ADD",
        ];

        $dataP = mis_std_parent::
        where('std_studentid',$std_studentid)
        ->where('pgm_id',$pgm_id)
        ->update($data);

        if($data){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Updated',
                'data'=>$data,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Failed',
                'data'=>'',
            ],400);
        }
    }

    public function list(){
        $data = mis_std_parent::select('*')->get();

        if($data){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$data,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],400);
        }
    }

    public function show($id,$pgm_id){
        $data = mis_std_parent::leftjoin('mis_relationship AS father_relationship','father_relationship.pk_id','mis_std_parent.par_father_relationship')
        ->leftjoin('mis_relationship AS mother_relationship','mother_relationship.pk_id','mis_std_parent.par_mother_relationship')
        ->where('std_studentid',$id)
        ->where('pgm_id',$pgm_id)
        ->first([
            'mis_std_parent.std_studentid',
            'mis_std_parent.pgm_id',
            'mis_std_parent.par_father_title',
            'mis_std_parent.par_father_name',
            'mis_std_parent.par_father_icno',
            'mis_std_parent.par_father_address',
            'mis_std_parent.par_father_contactno',
            'mis_std_parent.par_father_nationality',
            'mis_std_parent.par_father_relationship',
            'mis_std_parent.par_mother_title',
            'mis_std_parent.par_mother_name',
            'mis_std_parent.par_mother_icno',
            'mis_std_parent.par_mother_address',
            'mis_std_parent.par_mother_contactno',
            'mis_std_parent.par_mother_nationality',
            'mis_std_parent.par_mother_relationship',
            'father_relationship.relationship AS father_relationship',
            'mother_relationship.relationship AS mother_relationship',
        ]);

        if($data){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$data,
            ],200);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Proses Gagal',
                'data'=>'',
            ],200);
        }
    }
}
