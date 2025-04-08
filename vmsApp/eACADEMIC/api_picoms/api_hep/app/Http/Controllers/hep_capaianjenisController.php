<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_capaianjenis;
use Illuminate\Support\Facades\DB;

class hep_capaianjenisController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }



    //----------------Start function register----------------//
    public function register(Request $request)
    {

        // $as_user = as_user::create($request->all());
        $id_jenisCapaian = $request->input('id_jenisCapaian');

        $namaCapaian = $request->input('namaCapaian');
        $uniqueCapaian = $request->input('uniqueCapaian');
        $created_by = $request->input('created_by');
        $updated_by = $request->input('updated_by');
        // $recordstatus = $request->input('recordstatus');


        $data = [
            'namaCapaian' => $namaCapaian,
            'uniqueCapaian' => $uniqueCapaian,
            'created_by' => $created_by,
            'updated_by' => $updated_by,
            'recordstatus' => 'ADD',
        ];


        $resetIDwhendelete = DB::statement("ALTER TABLE hep_capaianjenis AUTO_INCREMENT =1");
        $obj = hep_capaianjenis::create($data);

        // $obj = as_user::create($request->all());

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => ""
            ], 400);
        }
    }
    //End function create
    //----------------Start function update----------------//
    public function update(Request $request)
    {
        $id_jenisCapaian = $request->input('id_jenisCapaian');

        $namaCapaian = $request->input('namaCapaian');
        $uniqueCapaian = $request->input('uniqueCapaian');
        $updated_by = $request->input('updated_by');


        $data = [
            'namaCapaian' => $namaCapaian,
            'uniqueCapaian' => $uniqueCapaian,
            'updated_by' => $updated_by,
            'recordstatus' => 'EDT',
        ];
        $obj = hep_capaianjenis::where('id_jenisCapaian', $id_jenisCapaian)->update($data);
        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj,
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => ""
            ], 400);
        }
    }

    //----------------Start function view----------------//
    public function view()
    {
        $obj = hep_capaianjenis::get();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "User Found Data.",
                'data' => $obj
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "User Not Found Data.",
                'data' => ''
            ]);
        }
    }
    //----------------End function view----------------//

    //----------------Start function view----------------//
    public function delete(Request $request)
    {
        $id_jenisCapaian = $request->input('id_jenisCapaian');

        $obj = hep_capaianjenis::where('id_jenisCapaian', $id_jenisCapaian)->update('recordstatus', 'DEL');

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Success Delete.",
                'data' => $obj
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Failed to delete.",
                'data' => ''
            ]);
        }
    }
    //----------------End function view----------------//



    public function UtkGenerateIDTable($inCharge)
    {

        //  $FK_users = $request->input('FK_users');

        $obj = hep_capaianjenis::
    where('hep_capaianjenis.inCharge','=',$inCharge)    
        ->where('hep_capaianjenis.recordstatus','!=','DEL')
        ->get(['id_jenisCapaian','namaCapaian','uniqueCapaian','inCharge']);


        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Found Data.",
                'data' => $obj
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Not Found Data.",
                'data' => ''
            ]);
        }
    }
    ////----------------End function list----------------//




    //Start function list
    public function list(Request $request)
    {
    }
    //End function list
}
    
    
    
    // function ---  create update list view
    // function ---  create update delete list view