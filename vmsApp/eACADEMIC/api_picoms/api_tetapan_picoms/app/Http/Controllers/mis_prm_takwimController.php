<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_prm_takwim;

class mis_prm_takwimController extends Controller
{
    public function register(Request $request){

        $attachment = null;
        if($request->hasFile('attachment')){
            $file = $request->file('attachment');
            $attachment = time() . $file->getClientOriginalName();
            $file->move('upload_annoucement', $attachment);
        }
        

        $twm_title = $request->input('twm_title');
        $twm_description = $request->input('twm_description');
        $twm_sdate = $request->input('twm_sdate');
        $twm_edate = $request->input('twm_edate');
        // $attachment = $request->input('attachment');
        $twm_status = $request->input('twm_status');
        $recordstatus = $request->input('recordstatus');

        
        // \DB::enableQueryLog();
        $obj = mis_prm_takwim::
        // create(["recordstatus" => 'ADD']);
        create(
            [
            'twm_title' => $twm_title,
            'twm_description' => $twm_description,
            'twm_sdate' => $twm_sdate,
            'twm_edate' => $twm_edate,
            'attachment' => $attachment,
            'twm_status' => $twm_status,
            'recordstatus' => $recordstatus,
        ]
    );
    // dd(\DB::getQueryLog());
    // DD('123');

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


    public function show(Request $request)  {
        $twm_id = $request->input('twm_id');

        $mis_prm_takwim = mis_prm_takwim::where('twm_id',$twm_id)->first();

        if ($mis_prm_takwim)   {
            return response()->json([
                'success'=>'true',
                'message'=>'Show Success!',
                'data'=>$mis_prm_takwim
            ],200);
        }
    }

    public function list()  {
        $mis_prm_takwim = mis_prm_takwim::where([['recordstatus','!=','DEL']])->get();

        if ($mis_prm_takwim)   {
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$mis_prm_takwim
            ],200);
        }
        
    }


    public function update(Request $request){

        $attachment = '';
        if($request->hasFile('attachment')){
            $file = $request->file('attachment');
            $attachment = time() . $file->getClientOriginalName();
            $file->move('upload_annoucement', $attachment);

            $twm_id = $request->input('twm_id');
            $twm_title = $request->input('twm_title');
            $twm_description = $request->input('twm_description');
            $twm_sdate = $request->input('twm_sdate');
            $twm_edate = $request->input('twm_edate');
            // $attachment = $request->input('attachment');
            $twm_status = $request->input('twm_status');
            $recordstatus = $request->input('recordstatus');

            $obj = mis_prm_takwim::where([['twm_id','=',$twm_id]])-> update([
                'twm_id' => $twm_id,
                'twm_title' => $twm_title,
                'twm_description' => $twm_description,
                'twm_sdate' => $twm_sdate,
                'twm_edate' => $twm_edate,
                'attachment' => $attachment,
                'twm_status' => $twm_status,
                'recordstatus' => $recordstatus,
            ]);
        }
        else
        {
            $twm_id = $request->input('twm_id');
            $twm_title = $request->input('twm_title');
            $twm_description = $request->input('twm_description');
            $twm_sdate = $request->input('twm_sdate');
            $twm_edate = $request->input('twm_edate');
            // $attachment = $request->input('attachment');
            $twm_status = $request->input('twm_status');
            $recordstatus = $request->input('recordstatus');

            $obj = mis_prm_takwim::where([['twm_id','=',$twm_id]])-> update([
                'twm_id' => $twm_id,
                'twm_title' => $twm_title,
                'twm_description' => $twm_description,
                'twm_sdate' => $twm_sdate,
                'twm_edate' => $twm_edate,
                // 'attachment' => $attachment,
                'twm_status' => $twm_status,
                'recordstatus' => $recordstatus,
            ]);
        }

        

        if ($obj){
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
            ],404);
        }
    }
    

    public function delete(Request $request){
        $twm_id = $request->input('twm_id');
        $recordstatus = $request->input('recordstatus');
        // $lastupdateon = $request->input('lastupdateon');
        // $lastupdateby = $request->input('lastupdateby');
        // $lastapproveon = $request->input('lastapproveon');
        // $lastapproveby = $request->input('lastapproveby');
        // $recordstatus = $request->input('recordstatus');

        $mis_prm_takwim = mis_prm_takwim::where('twm_id',$twm_id)-> update([
            'recordstatus' => $recordstatus,
            // 'lastupdateon' => $lastupdateon,
            // 'lastupdateby' => $lastupdateby,
            // 'lastapproveon' => $lastapproveon,
            // 'lastapproveby' => $lastapproveby,
            // 'recordstatus' => $recordstatus,
        ]);

        if ($mis_prm_takwim)  {
            return response()->json([
                'success'=>true,
                'message'=>"Hapus Berjaya!",
                'data' => $mis_prm_takwim
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
    
    
    public function listByStd(){
        $obj = mis_prm_takwim::where([['twm_status','=','Active'],['recordstatus','!=','DEL']])->get();

        if ($obj){
            return response()->json([
                'success'=>'true',
                'message'=>'List Success!',
                'data'=>$obj
            ],200);
        }
    }
}
