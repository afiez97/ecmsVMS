<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_capaianUsr;
use App\Models\hep_capaianjenis;
use Illuminate\Support\Facades\DB;

class hep_capaianUsrController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }



    //----------------Start function register----------------//
    public function register(Request $request)
    {

        // $as_user = as_user::create($request->all());
        $FK_users = $request->input('FK_users');
        $FK_capaianjenis = $request->input('FK_capaianjenis');
        $created_by = $request->input('created_by');
        $updated_by = $request->input('updated_by');


        $data = [
            'FK_users' => $FK_users,
            'FK_capaianjenis' => $FK_capaianjenis,
            'created_by' => $created_by,
            'updated_by' => $updated_by,
            'recordstatus' => 'ADD',
        ];



        $resetIDwhendelete= DB::statement("ALTER TABLE hep_capaianjenis AUTO_INCREMENT =1");
        $obj = hep_capaianUsr::create($data);

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
    //----------------End function register----------------//

    //----------------Start function update----------------//
    public function update(Request $request)
    {
        $id_capaianUsr = $request->input('id_capaianUsr');

        $FK_users = $request->input('FK_users');
        $FK_capaianjenis = $request->input('FK_capaianjenis');
        $updated_by = $request->input('updated_by');


        $data = [
            'FK_users' => $FK_users,
            'FK_capaianjenis' => $FK_capaianjenis,
            'updated_by' => $updated_by,
            'recordstatus' => 'EDT',
        ];



        $obj = hep_capaianUsr::where('id_capaianUsr', $id_capaianUsr)
            ->update($data);
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
    //----------------End function update----------------//


    //----------------Start function view----------------//
    public function view()
    {
        $obj = hep_capaianUsr::get();

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

    //----------------Start function delete----------------//
    public function delete(Request $request)
    {

        $id_capaianUsr = $request->input('id_capaianUsr');

        $obj = hep_capaianUsr::where('id_capaianUsr', $id_capaianUsr)
        ->update(['recordstatus'=> 'DEL']);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Success Delete.",
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
    //----------------End function delete ----------------//


    //----------------Start function list----------------//
    public function viewByFKjeniscapaian($uniqueCapaian)
    {

        // $FK_jenisCapaian = $request->input('FK_jenisCapaian');

        $obj = hep_capaianUsr::
        leftjoin('hep_capaianjenis','hep_capaianjenis.id_jenisCapaian','=','hep_capaianUsr.FK_capaianjenis')
        ->leftjoin('sad_users','sad_users.usr_id','=','hep_capaianUsr.FK_users')
        ->where('hep_capaianjenis.uniqueCapaian','=',$uniqueCapaian)    
        ->where('hep_capaianUsr.recordstatus','!=','DEL')    
        ->where('hep_capaianUsr.FK_users', 'NOT LIKE', '%user%')
   
        ->get(
            [
                'id_capaianUsr',
                'FK_capaianjenis',
                'namaCapaian',
                'uniqueCapaian',
                'inCharge',
                'hep_capaianUsr.recordstatus',
                'hep_capaianUsr.FK_users',
                'sad_users.usr_name',
                'sad_users.usr_icno',
                'sad_users.usr_status',
            ]
        );

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


    //----------------Start function list----------------//
    public function list(Request $request)
    {
    }
    ////----------------End function list----------------//



     //----------------Start function listcheckingCapaian----------------//
     public function checkingCapaian($FK_users)
     {

    //  $FK_users = $request->input('FK_users');

        $obj = hep_capaianUsr::
        leftjoin('hep_capaianjenis','hep_capaianjenis.id_jenisCapaian','=','hep_capaianUsr.FK_capaianjenis')
        ->where('hep_capaianUsr.FK_users','=',$FK_users)    
        ->where('hep_capaianUsr.recordstatus','!=','DEL')
        ->get();

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
 




     //----------------Start function listcheckingCapaian----------------//
     public function ExistingUser($FK_users,$FK_capaianjenis)
     {

    //  $FK_users = $request->input('FK_users');
    
        $obj = hep_capaianUsr::
        where('hep_capaianUsr.FK_users','=',$FK_users)    
        ->where('hep_capaianUsr.FK_capaianjenis','=',$FK_capaianjenis)    
        ->where('hep_capaianUsr.recordstatus','!=','DEL')
        ->exists();

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


    //----------------Start function list----------------//
    public function listUnderIncharge($FK_users)
    {

        // $FK_jenisCapaian = $request->input('FK_jenisCapaian');

        // $obj = hep_capaianjenis::where('hep_capaianjenis.FK_users', '=', $FK_users)
        //     ->where('hep_capaianjenis.recordstatus', '!=', 'DEL')
        //     ->get();

        $str_incharge = '';
        $cart = array();

            $obj = hep_capaianUsr::where('hep_capaianUsr.FK_users', '=', $FK_users)
            ->leftJoin('hep_capaianjenis', 'hep_capaianjenis.id_jenisCapaian', '=', 'hep_capaianUsr.FK_capaianjenis')
            ->where('hep_capaianUsr.recordstatus', '!=', 'DEL')
            ->get(['id_capaianUsr','FK_users','id_jenisCapaian','inCharge']);
            if (sizeof($obj)>0) {

                // for ($i=0; $i < sizeof($obj); $i++) { 
                //     $inCharge = $obj[$i]->inCharge; // Extract id_survey from $obj
                //     // dump($inCharge);
                //     // $str_incharge .= $inCharge.',';
                //     $cart[]= $inCharge;

                // }   
                foreach ($obj as $item) {
                    $inCharges[] = $item->inCharge; 
                  }

                $final = hep_capaianjenis::
                where('hep_capaianjenis.recordstatus', '!=','DEL')
                ->whereIn('hep_capaianjenis.inCharge', $inCharges)
                ->orderBy('id_jenisCapaian', 'ASC')
                ->get(['id_jenisCapaian','namaCapaian','uniqueCapaian','uniqueCapaian','inCharge',]);
                // dd($final);

                // dump( $final);
            }
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Found Data.",
                'data' => $final
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


}
