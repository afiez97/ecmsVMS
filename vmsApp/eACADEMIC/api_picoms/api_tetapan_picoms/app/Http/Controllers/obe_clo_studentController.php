<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\obe_clo_student;
use App\Models\obe_clo;
use App\Models\sad_users;

class obe_clo_studentController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }
    
    public function create(Request $request){
        
        $obj = obe_clo_student::create([
            'FK_sad_users' => $request->input('std_studentid'),
            'FK_clo' => $request->input('FK_clo'),
            'clo_achieve' => $request->input('clo_achieve'),
            'attained_student' => $request->input('attained_student'),
            'lastupdateby' =>$request->input('lastupdateby'),
            'lastapproveby' =>$request->input('lastapproveby'),
            'recordstatus' => 'AKTIF',
        ]);
        if ($obj){
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


    public function show($id_clo_student){
        $obj = obe_clo_student::where('id_clo_student',$id_clo_student)->first();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$obj
            ],200);
        }
    }


    public function list()  {
        $obj = obe_clo_student::where('recordstatus','!=','DEL')->get();

        if ($obj)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
        
    }


    public function update(Request $request){


        $obj = obe_clo_student::where('id_clo_student',$request->input('id_clo_student'))-> update([
            'FK_student' => $request->input('FK_student'),
            'FK_clo' => $request->input('FK_clo'),
            'clo_achieve' => $request->input('clo_achieve'),
            'attained_student' => $request->input('attained_student'),
            'lastupdateby' =>$request->input('lastupdateby'),
            'lastapproveby' =>$request->input('lastapproveby'),
            'recordstatus' => 'AKTIF',
        ]); 

        if ($obj ){

            $updatedFields = [
                'FK_student' => $request->input('FK_student'),
                'FK_clo' => $request->input('FK_clo'),
                'clo_achieve' => $request->input('clo_achieve'),
                'attained_student' => $request->input('attained_student'),
                'lastupdateby' =>$request->input('lastupdateby'),
                'lastapproveby' =>$request->input('lastapproveby'),
                'recordstatus' => 'AKTIF',
            ];
            return response()->json([
                'success'=>true,
                'message'=>"Update Success!",
                'data' => $updatedFields
            ],200);
        }
        else{
            return response()->json([
                'success'=>false,
                'message'=>"Update Failed!",
                'data'=>''
            ],404);
        }
    }


    public function delete(Request $request){
        $id_clo_student = $request->input('id_clo_student');

        $obj = obe_clo_student::where('id_clo_student',$id_clo_student)-> update([
            'recordstatus' => 'DEL',
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

    // papar smua CLO student
    public function viewAllCLOStudent(Request $request){
        $id_clo_student = $request->input('id_clo_student');
        $FK_student = $request->input('FK_student');
        
      
        $obj = obe_clo_student::join('obe_clo', 'obe_clo_student.FK_clo', '=', 'obe_clo.id_clo')
                                ->leftjoin('sad_users', 'obe_clo_student.FK_sad_users', '=', 'sad_users.usr_id' )
                                ->where('obe_clo_student.FK_sad_users', $FK_student) // Use $FK_clo directly in the join condition
                                // ->where('obe_clo_student.FK_sad_users', $FK_student)
                                ->get(
                                    ['id_clo_student',
                                    // FK_course
                                    'usr_name',
                                    'FK_sad_users',
                                    'FK_clo',
                                    'clo_level',
                                    'clo_statement',
                                    'assesment_weightage',
                                    'attained_student',
                                    'assesment_weightage',
                                    'clo_achieve',
                                    ]
                                );
        if ($obj){
            return response()->json([
                'success'=>true,
                'message'=>"Berjaya Menjumpai Data!",
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



}
