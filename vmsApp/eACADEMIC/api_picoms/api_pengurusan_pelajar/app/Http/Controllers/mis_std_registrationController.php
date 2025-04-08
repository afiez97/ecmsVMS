<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\mis_std_registration;

class mis_std_registrationController extends Controller
{
    public function  __construct()
    {
        $this->middleware('auth');
    }

    public function create(Request $request){
        $std_studentid              = $request->input('std_studentid');
        $pgm_id                     = $request->input('pgm_id');
        $srg_payment_via            = $request->input('srg_payment_via');
        $srg_introducer_name        = $request->input('srg_introducer_name');
        $srg_payment_resit        = $request->input('srg_payment_resit');
        $lastupdateby               = $request->input('user_login');
        $recordstatus               = "ADD";


        if($file = $request->hasFile('srg_payment_resitdoc')){
            $file = $request->file('srg_payment_resitdoc');
            $srg_payment_resitdoc = $this->uploadFile($file,'_payment_resitdoc',$std_studentid);               
        }else{
            $srg_payment_resitdoc = '';
        }

        if($file = $request->hasFile('srg_mother_ic')){
            $file = $request->file('srg_mother_ic') ;
            $srg_mother_ic = $this->uploadFile($file,'_mother_ic',$std_studentid);
        }else{
            $srg_mother_ic = '';
        }

        if($file = $request->hasFile('srg_father_ic')){
            $file = $request->file('srg_father_ic') ;
            $srg_father_ic = $this->uploadFile($file,'_father_ic',$std_studentid);
        }else{
            $srg_father_ic = '';
        }

        if($file = $request->hasFile('srg_birth_cert')){
            $file = $request->file('srg_birth_cert') ;
            $srg_birth_cert = $this->uploadFile($file,'_birth_cert',$std_studentid);
        }else{
            $srg_birth_cert = '';
        }

        if($file = $request->hasFile('srg_accept_letter')){
            $file = $request->file('srg_accept_letter') ;
            $srg_accept_letter = $this->uploadFile($file,'_accept_letter',$std_studentid);
        }else{
            $srg_accept_letter = '';
        }

        if($file = $request->hasFile('srg_offer_letter')){
            $file = $request->file('srg_offer_letter') ;
            $srg_offer_letter = $this->uploadFile($file,'_offer_letter',$std_studentid);
        }else{
            $srg_offer_letter = '';
        }

        if($file = $request->hasFile('srg_spm_doc')){
            $file = $request->file('srg_spm_doc') ;
            $srg_spm_doc = $this->uploadFile($file,'_spm_doc',$std_studentid);
        }else{
            $srg_spm_doc = '';
        }

        if($file = $request->hasFile('srg_ic_pict')){
            $file = $request->file('srg_ic_pict') ;
            $srg_ic_pict = $this->uploadFile($file,'_ic_pict',$std_studentid);
        }else{
            $srg_ic_pict = '';
        }

        $data = [
            'std_studentid'         => $std_studentid,
            'pgm_id'                => $pgm_id ,
            'srg_payment_via'       => $srg_payment_via,
            'srg_payment_resit'     => $srg_payment_resit,
            'srg_introducer_name'   => $srg_introducer_name,
            'srg_payment_resitdoc'  => $srg_payment_resitdoc,
            'srg_ic_pict'           => $srg_ic_pict,
            'srg_spm_doc'           => $srg_spm_doc,
            'srg_offer_letter'      => $srg_offer_letter,
            'srg_accept_letter'     => $srg_accept_letter,
            'srg_birth_cert'        => $srg_birth_cert,
            'srg_father_ic'         => $srg_father_ic,
            'srg_mother_ic'         => $srg_mother_ic,
            'recordstatus'          => $recordstatus,
            'lastupdateby'          => $lastupdateby,

        ];

        $obj   = mis_std_registration::create($data);

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
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
    
    public function update(Request $request){
        $std_studentid              = $request->input('std_studentid');
        $pgm_id                     = $request->input('pgm_id');
        $srg_payment_via            = $request->input('srg_payment_via');
        $srg_introducer_name        = $request->input('srg_introducer_name');
        $srg_payment_resit          = $request->input('srg_payment_resit');
        $lastupdateby               = $request->input('user_login');
        $recordstatus               = "EDT";

        $objReg = mis_std_registration::where([['recordstatus','!=','DEL'],['std_studentid','=',$std_studentid]])->first();

        if($file = $request->hasFile('srg_payment_resitdoc')){
            $file = $request->file('srg_payment_resitdoc');
            $srg_payment_resitdoc = $this->uploadFile($file,'_payment_resitdoc',$std_studentid);
            if($srg_payment_resitdoc == ""){
                $srg_payment_resitdoc = $objReg->srg_payment_resitdoc;                
            }              
        }else{
            $srg_payment_resitdoc = $objReg->srg_payment_resitdoc;
        }

        if($file = $request->hasFile('srg_mother_ic')){
            $file = $request->file('srg_mother_ic') ;
            $srg_mother_ic = $this->uploadFile($file,'_mother_ic',$std_studentid);
            if($srg_mother_ic == ""){
                $srg_mother_ic = $objReg->srg_mother_ic;                
            }
        }else{
            $srg_mother_ic = $objReg->srg_mother_ic;
        }

        if($file = $request->hasFile('srg_father_ic')){
            $file = $request->file('srg_father_ic') ;
            $srg_father_ic = $this->uploadFile($file,'_father_ic',$std_studentid);
            if($srg_father_ic == ""){
                $srg_father_ic = $objReg->srg_father_ic;
            }
        }else{
            $srg_father_ic = $objReg->srg_father_ic;
        }

        if($file = $request->hasFile('srg_birth_cert')){
            $file = $request->file('srg_birth_cert') ;
            $srg_birth_cert = $this->uploadFile($file,'_birth_cert',$std_studentid);
            if($srg_birth_cert){
                $srg_birth_cert = $objReg->srg_birth_cert;
            }
        }else{
            $srg_birth_cert = $objReg->srg_birth_cert;
        }

        if($file = $request->hasFile('srg_accept_letter')){
            $file = $request->file('srg_accept_letter') ;
            $srg_accept_letter = $this->uploadFile($file,'_accept_letter',$std_studentid);
            if($srg_accept_letter == ""){
                $srg_accept_letter = $objReg->srg_accept_letter;
            }
        }else{
            $srg_accept_letter = $objReg->srg_accept_letter;
        }

        if($file = $request->hasFile('srg_offer_letter')){
            $file = $request->file('srg_offer_letter') ;
            $srg_offer_letter = $this->uploadFile($file,'_offer_letter',$std_studentid);
            if($srg_offer_letter == ""){
                $srg_offer_letter = $objReg->srg_offer_letter;
            }
        }else{
            $srg_offer_letter = $objReg->srg_offer_letter;
        }

        if($file = $request->hasFile('srg_spm_doc')){
            $file = $request->file('srg_spm_doc') ;
            $srg_spm_doc = $this->uploadFile($file,'_spm_doc',$std_studentid);
            if($srg_spm_doc == ""){
                $srg_spm_doc = $objReg->srg_spm_doc;
            }
        }else{
            $srg_spm_doc = $objReg->srg_spm_doc;
        }
        
        if($file = $request->hasFile('srg_ic_pict')){
            $file = $request->file('srg_ic_pict') ;
            $srg_ic_pict = $this->uploadFile($file,'_ic_pict',$std_studentid);
            if($srg_ic_pict == ""){
                $srg_ic_pict = $objReg->srg_ic_pict;
            }
        }else{
            $srg_ic_pict = $objReg->srg_ic_pict;
        }

        $data = [
            'std_studentid'         => $std_studentid,
            'pgm_id'                => $pgm_id ,
            'srg_payment_via'       => $srg_payment_via,
            'srg_payment_resit'     => $srg_payment_resit,
            'srg_introducer_name'   => $srg_introducer_name,
            'srg_payment_resitdoc'  => $srg_payment_resitdoc,
            'srg_ic_pict'           => $srg_ic_pict,
            'srg_spm_doc'           => $srg_spm_doc,
            'srg_offer_letter'      => $srg_offer_letter,
            'srg_accept_letter'     => $srg_accept_letter,
            'srg_birth_cert'        => $srg_birth_cert,
            'srg_father_ic'         => $srg_father_ic,
            'srg_mother_ic'         => $srg_mother_ic,
            'recordstatus'          => $recordstatus,
            'lastupdateby'          => $lastupdateby,

        ];

        $obj   = mis_std_registration::where('std_studentid',$std_studentid)->update($data);

        if($obj){           
            return response()->json([
                'success'=>true,
                'messages'=>'Update Success',
                'data'=>$obj,
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
    public function show($id){

        $obj = mis_std_registration::where([['recordstatus','!=','DEL'],['std_studentid','=',$id]])->first();
        if($obj){

            return response()->json([
                'success'=>true,
                'messages'=>'Proses Berjaya',
                'data'=>$obj,
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
    public function list(){}
    public function delete(Request $request){}

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
