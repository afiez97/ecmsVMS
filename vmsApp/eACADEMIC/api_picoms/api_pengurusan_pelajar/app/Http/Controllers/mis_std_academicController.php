<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_academic;

class mis_std_academicController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){

        $std_studentid        = $request->input('std_studentid');
        $sta_muet             = $request->input('sta_muet');
        $sta_bm_spm           = $request->input('sta_bm_spm');
        $sta_bi_spm           = $request->input('sta_bi_spm');       
        $sta_math_spm           = $request->input('sta_math_spm');       
        $sta_his_spm           = $request->input('sta_his_spm');       
        $sta_islam_spm           = $request->input('sta_islam_spm');

        $sta_other1_spm           = $request->input('sta_other1_spm');       
        $sta_other2_spm           = $request->input('sta_other2_spm');       
        $sta_other3_spm           = $request->input('sta_other3_spm');       
        $sta_other4_spm           = $request->input('sta_other4_spm');       
        $sta_other5_spm           = $request->input('sta_other5_spm');       

        $sta_sub1_spm           = $request->input('sta_sub1_spm');       
        $sta_sub2_spm           = $request->input('sta_sub2_spm');       
        $sta_sub3_spm           = $request->input('sta_sub3_spm');       
        $sta_sub4_spm           = $request->input('sta_sub4_spm');       
        $sta_sub5_spm           = $request->input('sta_sub5_spm');

        //CERT DOC
        if($file = $request->hasFile('sta_spm_doc')){
            $file = $request->file('sta_spm_doc');
            $sta_spm_doc = $this->uploadFile($file,'_spm_doc',$std_studentid);               
        }else{
            $sta_spm_doc = '';
        }

        $data = [
            'std_studentid' => $std_studentid,
            'sta_muet' => $sta_muet,
            'sta_bm_spm' => $sta_bm_spm,
            'sta_bi_spm' => $sta_bi_spm,
            'sta_math_spm' => $sta_math_spm,
            'sta_his_spm' => $sta_his_spm,
            'sta_islam_spm' => $sta_islam_spm,

            'sta_other1_spm' => $sta_other1_spm,
            'sta_other2_spm' => $sta_other2_spm,
            'sta_other3_spm' => $sta_other3_spm,
            'sta_other4_spm' => $sta_other4_spm,
            'sta_other5_spm' => $sta_other5_spm,

            'sta_sub1_spm' => $sta_sub1_spm,
            'sta_sub2_spm' => $sta_sub2_spm,
            'sta_sub3_spm' => $sta_sub3_spm,
            'sta_sub4_spm' => $sta_sub4_spm,
            'sta_sub5_spm' => $sta_sub5_spm,
            'sta_spm_doc' => $sta_spm_doc,
            'recordstatus' => "ADD",
        ];

        $mis_std_academic = mis_std_academic::create($data);

        if($mis_std_academic){

            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Register',
                'data'=>$mis_std_academic,
            ],201);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Registration Failed',
                'data'=>'',
            ],401);
        }

    }

    public function update(Request $request){
        $std_studentid        = $request->input('std_studentid');

        $sta_muet             = $request->input('sta_muet');
        $sta_bm_spm           = $request->input('sta_bm_spm');
        $sta_bi_spm           = $request->input('sta_bi_spm');       
        $sta_math_spm           = $request->input('sta_math_spm');       
        $sta_his_spm           = $request->input('sta_his_spm');       
        $sta_islam_spm           = $request->input('sta_islam_spm');

        $sta_other1_spm           = $request->input('sta_other1_spm');       
        $sta_other2_spm           = $request->input('sta_other2_spm');       
        $sta_other3_spm           = $request->input('sta_other3_spm');       
        $sta_other4_spm           = $request->input('sta_other4_spm');       
        $sta_other5_spm           = $request->input('sta_other5_spm');       

        $sta_sub1_spm           = $request->input('sta_sub1_spm');       
        $sta_sub2_spm           = $request->input('sta_sub2_spm');       
        $sta_sub3_spm           = $request->input('sta_sub3_spm');       
        $sta_sub4_spm           = $request->input('sta_sub4_spm');       
        $sta_sub5_spm           = $request->input('sta_sub5_spm');
        
        $objReg = mis_std_academic::where([['recordstatus','!=','DEL'],['std_studentid','=',$std_studentid]])->first();

        //CERT DOC
        if($file = $request->hasFile('sta_spm_doc')){
            $file = $request->file('sta_spm_doc');
            $sta_spm_doc = $this->uploadFile($file,'_spm_doc',$std_studentid);
            if($sta_spm_doc == ""){
                $sta_spm_doc = $objReg->sta_spm_doc;                
            }             
        }else{
            $sta_spm_doc = $objReg->sta_spm_doc;
        }

        $data = [
            'sta_muet' => $sta_muet,
            'sta_bm_spm' => $sta_bm_spm,
            'sta_bi_spm' => $sta_bi_spm,
            'sta_math_spm' => $sta_math_spm,
            'sta_his_spm' => $sta_his_spm,
            'sta_islam_spm' => $sta_islam_spm,

            'sta_other1_spm' => $sta_other1_spm,
            'sta_other2_spm' => $sta_other2_spm,
            'sta_other3_spm' => $sta_other3_spm,
            'sta_other4_spm' => $sta_other4_spm,
            'sta_other5_spm' => $sta_other5_spm,

            'sta_sub1_spm' => $sta_sub1_spm,
            'sta_sub2_spm' => $sta_sub2_spm,
            'sta_sub3_spm' => $sta_sub3_spm,
            'sta_sub4_spm' => $sta_sub4_spm,
            'sta_sub5_spm' => $sta_sub5_spm,
            'sta_spm_doc' => $sta_spm_doc,
            'recordstatus' => "EDT",
        ];

        $mis_std_academic = mis_std_academic::where('std_studentid',$std_studentid)->update($data);

        if($mis_std_academic){
            $objReg = mis_std_academic::where([['recordstatus','!=','DEL'],['std_studentid','=',$std_studentid]])->first();
            return response()->json([
                'success'=>true,
                'messages'=>'Successfully Update',
                'data'=>$objReg,
            ],202);
        }
        else {
            return response()->json([
                'success'=>false,
                'messages'=>'Update Failed',
                'data'=>'',
            ],402);
        }
    }

    public function list(){
        $data = mis_std_academic::select('*')->get();

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
            ],400);
        }
    }

    public function show($id){
        $data = mis_std_academic::where('std_studentid',$id)
        ->where('recordstatus','!=','DEL')
        ->first();

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
            ],200);
        }
    }

    public function uploadFile($file,$field,$std_studentid){
        $file_name = "";

        $file_type = $file->getClientOriginalExtension();

        if((strtolower($file_type) == "jpg") || (strtolower($file_type) == "jpeg") || (strtolower($file_type) == "pdf") || (strtolower($file_type) == "png")){
            $file_name = $std_studentid.$field.'.'.$file_type ;
            $destinationPath = 'academic' ;            
            if($file->move($destinationPath,$file_name)){
                //ok
            }
            else{
                $file_name = "";
            }

        }

        return $file_name;
    }
}
