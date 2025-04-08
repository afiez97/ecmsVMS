<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_program;
use App\Models\hep_hostel_chkinout;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class hep_programController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        // upload proposal
        $progProposal = '';

        if ($request->hasFile('prog_proposal')) {
            $file = $request->file('prog_proposal');
            $allowedfileExtention = ['pdf'];
            $extention = $file->getClientOriginalExtension();
            $check = in_array($extention, $allowedfileExtention);

            if ($check) {
                $progProposal = time() . $file->getClientOriginalName();
                $file->move('proposal', $progProposal);
            }
        }

        $clg_id = $request->input('clg_id');
        $prog_title = $request->input('prog_title');
        $prog_org = $request->input('prog_org');
        $prog_category_id = $request->input('prog_category_id');
        $prog_vent = $request->input('prog_vent');
        $prog_startdate = $request->input('prog_startdate');
        $prog_enddate = $request->input('prog_enddate');
        $prog_venue = $request->input('prog_venue');
        $prog_advisor = $request->input('prog_advisor');
        $prog_status = $request->input('prog_status');
        $user_id = $request->input('user_id');
        $user_type = $request->input('user_type');
        $prog_cost = $request->input('prog_cost');
        $prog_peruntukan = $request->input('prog_peruntukan');
        $prog_participate = $request->input('prog_participate');
        $recordstatus = $request->input('recordstatus');

        // $dateApplication = 

        date_default_timezone_set('Asia/Kuala_Lumpur');

        $obj = hep_program::create([
            'clg_id' => $clg_id,
            'prog_title' => $prog_title,
            'prog_org' => $prog_org,
            'prog_category_id' => $prog_category_id,
            'prog_vent' => $prog_vent,
            'prog_proposal' => $progProposal,
            'prog_startdate' => $prog_startdate,
            'prog_enddate' => $prog_enddate,
            'prog_venue' => $prog_venue,
            'prog_advisor' => $prog_advisor,
            'prog_status' => $prog_status,
            'user_id' => $user_id,
            'user_type' => $user_type,
            'prog_cost' => $prog_cost,
            'prog_peruntukan' => $prog_peruntukan,
            'prog_participate' => $prog_participate,
            'recordstatus' => $recordstatus,

            'dateApplication' => date('Y-m-d H:i:s')
        ]);

        if ($obj) {


            if ($prog_status == 'New') {
                // 
                $EmailPurpose = hep_program::where('id_program', $obj->id_program)
                    // ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_change.stud_id')
                    ->select(
                        // 'mis_std_info.sti_name',
                        '*'
                    )
                    ->first(); // Or get() if you expect multiple results
                $data = array(
                    'name' => '',
                    'idStdStaff' => $EmailPurpose->user_id,
                    'title' => 'You have received a <b>Programme Application</b> according to the details below:',
                    'hep_program' => $EmailPurpose->prog_title,
                    'content' => "
                   
                    <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
            <tr>
                <th colspan='2'><strong>Programme Application Details</strong></th>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Programme Name</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->prog_title}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Venue</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->prog_venue}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Organizer</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->prog_org}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Date</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->prog_startdate} - {$EmailPurpose->prog_enddate}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Programme Category</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->prog_category_id}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Date Application</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->dateApplication}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$prog_status}</strong></td>
            </tr>
        </table>  ",
                );
                // dd($EmailPurpose);
    
                Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
                    $message->to('aktivitimahasiswa@ucmi.edu.my', 'UNIT PEMBANGUNAN HOLISTIK MAHASISWA')
                    // $message->to('ehepa@ucmi.edu.my', 'Hal Ehwal Pelajar')
                    ->subject('Programme Application');
                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from($EmailPurpose->user_id . '@student.ucmi.edu.my',  $EmailPurpose->user_id);
                });
            }
            return response()->json([
                'success' => 'true',
                'message' => 'Register Success!',
                'data' => $obj
            ], 201);
        } else {
            return response()->json([
                'success' => 'false',
                'message' => 'Bad Request',
                'data' => $obj
            ], 400);
        }
    }


    public function show($id)
    {
        $obj = hep_program::where('id_program', '=', $id)
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_program.clg_id')
            ->first([
                'id_program',
                'hep_program.clg_id AS clgId',
                'clg_name',
                'prog_title',
                'prog_org',
                'prog_category_id',
                'prog_vent',
                'prog_advisor',
                'prog_venue',
                'prog_startdate',
                'prog_enddate',
                'prog_proposal',
                'prog_cert',
                'prog_report',
                'prog_status',
                'prog_statusremark',
                'user_id',
                'prog_peruntukan',
                'prog_alloc_approve',
                'prog_participate',
                'prog_cost'
            ]);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function list()
    {
        $obj = hep_program::select([
                'id_program',
                'hep_program.clg_id AS clgId',
                'clg_name',
                'prog_title',
                'prog_org',
                'prog_category_id',
                'prog_vent',
                'prog_advisor',
                'prog_venue',
                'prog_startdate',
                'prog_enddate',
                'prog_proposal',
                'prog_category_id',
                'prog_cert',
                'prog_report',
                'prog_status',
                'prog_statusremark',
                'user_id',
                'user_type',
                'usr_name',
                'prog_peruntukan',
                'prog_cost',
                'prog_alloc_approve',
                'hep_program.prog_participate',
                'dateApplication'
            ])
            ->where([['hep_program.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_program.clg_id')
            ->leftjoin('sad_users', 'sad_users.usr_id', '=', 'hep_program.user_id')
            ->orderBy('prog_startdate', 'DESC')
            ->orderBy('id_program', 'DESC')
            ->get();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }



    // update new data
    public function update(Request $request)
    {
        // upload proposal
        $uptProp = $request->input('exist_prog_proposal');
        if ($request->hasFile('prog_proposal')) {
            $fileProp = $request->file('prog_proposal');
            $uptProp = time() . $fileProp->getClientOriginalName();
            $fileProp->move('proposal', $uptProp);
        }

        $id_program = $request->input('id_program');
        $clg_id = $request->input('clg_id');
        $prog_title = $request->input('prog_title');
        $prog_org = $request->input('prog_org');
        $prog_category_id = $request->input('prog_category_id');
        $prog_vent = $request->input('prog_vent');
        $prog_startdate = $request->input('prog_startdate');
        $prog_enddate = $request->input('prog_enddate');
        $prog_venue = $request->input('prog_venue');
        $prog_advisor = $request->input('prog_advisor');
        $prog_status = $request->input('prog_status');
        $prog_statusremark = $request->input('prog_statusremark');
        $notify_user = $request->input('notify_user');
        $prog_cost = $request->input('prog_cost');
        $prog_peruntukan = $request->input('prog_peruntukan');
        $prog_alloc_approve = $request->input('prog_alloc_approve');
        $prog_participate = $request->input('prog_participate');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_program::where([['id_program', '=', $id_program]])->update([
            'clg_id' => $clg_id,
            'prog_title' => $prog_title,
            'prog_org' => $prog_org,
            'prog_category_id' => $prog_category_id,
            'prog_vent' => $prog_vent,
            'prog_proposal' => $uptProp,
            'prog_startdate' => $prog_startdate,
            'prog_enddate' => $prog_enddate,
            'prog_venue' => $prog_venue,
            'prog_advisor' => $prog_advisor,
            'prog_status' => $prog_status,
            'prog_statusremark' => $prog_statusremark,
            'notify_user' => $notify_user,
            'prog_cost' => $prog_cost,
            'prog_peruntukan' => $prog_peruntukan,
            'prog_alloc_approve' => $prog_alloc_approve,
            'prog_participate' => $prog_participate,
            'recordstatus' => $recordstatus,
        ]);
        if ($obj) {


            if ($prog_status == 'New' || $prog_status == 'Accept' || $prog_status == 'Reject') {
                // 
                $EmailPurpose = hep_program::where('id_program', $id_program)
                    // ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_change.stud_id')
                    ->select(
                        // 'mis_std_info.sti_name',
                        '*'
                    )
                    ->first(); // Or get() if you expect multiple results
                $data = array(
                    'name' => '',
                    'idStdStaff' => $EmailPurpose->user_id,
                    'title' => "Your <strong>Programme Application</strong> has been updated according to the details below:",
                    'hep_program' => $EmailPurpose->prog_title,
                    'content' => "
                             <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
            <tr>
                <th colspan='2'><strong>Programme Application Details</strong></th>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Programme Name</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->prog_title}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd;text-align: left; padding: 0 8px;'>Venue</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->prog_venue}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd;text-align: left; padding: 0 8px;'>Organizer</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->prog_org}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Date</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->prog_startdate} - {$EmailPurpose->prog_enddate}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Programme Category</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->prog_category_id}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Date Application</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$EmailPurpose->dateApplication}</strong></td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$prog_status}</strong></td>
            </tr>
        </table>
                        
        ",
                );
    
                Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to('mohdafiez7@gmail.com', ' $array->std_name')->subject('Programme Application');

                  $email = '';
$getemail =  DB::table('sad_users')->select('sad_users.usr_id', 'sti_email', 'emp_email', 'hrm_emp_info.emp_id', 'mis_std_info.std_studentid')
->where('sad_users.usr_id', $EmailPurpose->user_id)->leftJoin('hrm_emp_info', 'hrm_emp_info.emp_id', '=', 'sad_users.usr_id')
->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'sad_users.usr_id')->first();


if ($getemail->std_studentid) {
    $email = $EmailPurpose->user_id . '@student.ucmi.edu.my';

    $message->to($email,  $EmailPurpose->user_id)
    ->subject('Programme Application');
    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
    // $message->from('ehepa@ucmi.edu.my', 'Hal Ehwal Pelajar');
    $message->from('aktivitimahasiswa@ucmi.edu.my', 'UNIT PEMBANGUNAN HOLISTIK MAHASISWA');

}else{

    if ($getemail->emp_email) {
        $email = $getemail->emp_email;

        $message->to($email,  $EmailPurpose->user_id)
        ->subject('Programme Application');
        // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
    $message->from('aktivitimahasiswa@ucmi.edu.my', 'UNIT PEMBANGUNAN HOLISTIK MAHASISWA');
        // $message->from('ehepa@ucmi.edu.my', 'Hal Ehwal Pelajar');
    } 
}

                });
            }
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    public function delete(Request $request)
    {
        $recordstatus = $request->input('recordstatus');
        $id_program = $request->input('id_program');

        $obj = hep_program::where('id_program', $id_program)->update([
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Hapus Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Hapus Gagal!",
                'data' => ''
            ], 401);
        }
    }


    public function countAlert()
    {
        $obj = hep_program::where([['recordstatus', '!=', 'DEL'], ['prog_status', '=', 'New']])->get(['id_program']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function listStud()
    {
        $obj = hep_program::SELECT('hep_program.*', 'clg_name')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_program.clg_id')
            ->where([['hep_program.recordstatus', '!=', 'DEL'], ['hep_program.prog_status', '=', 'In Progress']])
            ->orderBy('prog_startdate', 'DESC')->get();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // list by user who create new program/activity
    public function listByUser($id)
    {
        $obj = hep_program::where([['hep_program.user_id', '=', $id], ['hep_program.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_program.clg_id')
            ->leftjoin('sad_users', 'sad_users.usr_id', '=', 'hep_program.user_id')
            ->orderBy('prog_startdate', 'DESC')
            ->get(
                [
                    'id_program',
                    'hep_program.clg_id AS clgId',
                    'clg_name',
                    'prog_title',
                    'prog_org',
                    'prog_vent',
                    'prog_advisor',
                    'prog_venue',
                    'prog_startdate',
                    'prog_enddate',
                    'prog_proposal',
                    'prog_category_id',
                    'prog_cert',
                    'prog_report',
                    'prog_status',
                    'prog_statusremark',
                    'user_id',
                    'usr_name',
                    'prog_participate',
                    'dateApplication',
                    'prog_alloc_approve',
                    'prog_peruntukan',
                    'prog_cost',
                ]
            );

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update report after status accepted
    public function uptReport(Request $request)
    {
        // upload proposal
        $uptProp = $request->input('exist_prog_proposal');
        if ($request->hasFile('prog_proposal')) {
            $fileProp = $request->file('prog_proposal');
            $uptProp = time() . $fileProp->getClientOriginalName();
            $fileProp->move('proposal', $uptProp);
        }

        // upload report
        $uptReport = $request->input('exist_prog_report');
        if ($request->hasFile('prog_report')) {
            $fileRep = $request->file('prog_report');
            $uptReport = time() . $fileRep->getClientOriginalName();
            $fileRep->move('progAct_report', $uptReport);
        }

        // upload certificate
        $uptCert = $request->input('exist_prog_cert');
        if ($request->hasFile('prog_cert')) {
            $fileCert = $request->file('prog_cert');
            $uptCert = time() . $fileCert->getClientOriginalName();
            $fileCert->move('progAct_cert', $uptCert);
        }

        $id_program = $request->input('id_program');
        $clg_id = $request->input('clg_id');
        $prog_title = $request->input('prog_title');
        $prog_org = $request->input('prog_org');
        $prog_category_id = $request->input('prog_category_id');
        $prog_vent = $request->input('prog_vent');
        $prog_startdate = $request->input('prog_startdate');
        $prog_enddate = $request->input('prog_enddate');
        $prog_venue = $request->input('prog_venue');
        $prog_advisor = $request->input('prog_advisor');
        $prog_status = $request->input('prog_status');
        $prog_statusremark = $request->input('prog_statusremark');
        $notify_user = $request->input('notify_user');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_program::where([['id_program', '=', $id_program]])->update([
            'clg_id' => $clg_id,
            'prog_title' => $prog_title,
            'prog_org' => $prog_org,
            'prog_category_id' => $prog_category_id,
            'prog_vent' => $prog_vent,
            'prog_proposal' => $uptProp,
            'prog_startdate' => $prog_startdate,
            'prog_enddate' => $prog_enddate,
            'prog_venue' => $prog_venue,
            'prog_advisor' => $prog_advisor,
            'prog_report' => $uptReport,
            'prog_cert' => $uptCert,
            'prog_status' => $prog_status,
            'prog_statusremark' => $prog_statusremark,
            'notify_user' => $notify_user,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // update report by student
    public function uptRprtByStd(Request $request)
    {
        // upload proposal
        $uptProp = $request->input('exist_prog_proposal');
        if ($request->hasFile('prog_proposal')) {
            $fileProp = $request->file('prog_proposal');
            $uptProp = time() . $fileProp->getClientOriginalName();
            $fileProp->move('proposal', $uptProp);
        }

        // upload report
        $uptReport = $request->input('exist_prog_report');
        if ($request->hasFile('prog_report')) {
            $fileRep = $request->file('prog_report');
            $uptReport = time() . $fileRep->getClientOriginalName();
            $fileRep->move('progAct_report', $uptReport);
        }

        $id_program = $request->input('id_program');
        $clg_id = $request->input('clg_id');
        $prog_title = $request->input('prog_title');
        $prog_org = $request->input('prog_org');
        $prog_vent = $request->input('prog_vent');
        $prog_startdate = $request->input('prog_startdate');
        $prog_enddate = $request->input('prog_enddate');
        $prog_venue = $request->input('prog_venue');
        $prog_advisor = $request->input('prog_advisor');

        $recordstatus = $request->input('recordstatus');

        $obj = hep_program::where([['id_program', '=', $id_program]])->update([
            'clg_id' => $clg_id,
            'prog_title' => $prog_title,
            'prog_org' => $prog_org,
            'prog_vent' => $prog_vent,
            'prog_proposal' => $uptProp,
            'prog_startdate' => $prog_startdate,
            'prog_enddate' => $prog_enddate,
            'prog_venue' => $prog_venue,
            'prog_advisor' => $prog_advisor,
            'prog_report' => $uptReport,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // list Program & Activity status accepted by user who created program
    public function countAccProg($id)
    {
        $obj = hep_program::where([
            ['recordstatus', '!=', 'DEL'],
            ['notify_user', '=', 'Yes'],
            ['user_id', '=', $id]
        ])->get(['id_program']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update new data by student
    public function uptNewByStd(Request $request)
    {
        // upload proposal
        $uptProp = $request->input('exist_prog_proposal');
        if ($request->hasFile('prog_proposal')) {
            $fileProp = $request->file('prog_proposal');
            $uptProp = time() . $fileProp->getClientOriginalName();
            $fileProp->move('proposal', $uptProp);
        }

        $id_program = $request->input('id_program');
        $clg_id = $request->input('clg_id');
        $prog_title = $request->input('prog_title');
        $prog_org = $request->input('prog_org');
        $prog_category_id = $request->input('prog_kat');
        $prog_vent = $request->input('prog_vent');
        $prog_startdate = $request->input('prog_startdate');
        $prog_enddate = $request->input('prog_enddate');
        $prog_venue = $request->input('prog_venue');
        $prog_advisor = $request->input('prog_advisor');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_program::where([['id_program', '=', $id_program]])->update([
            'clg_id' => $clg_id,
            'prog_title' => $prog_title,
            'prog_org' => $prog_org,
            'prog_category_id' => $prog_category_id,
            'prog_vent' => $prog_vent,
            'prog_proposal' => $uptProp,
            'prog_startdate' => $prog_startdate,
            'prog_enddate' => $prog_enddate,
            'prog_venue' => $prog_venue,
            'prog_advisor' => $prog_advisor,
            'recordstatus' => $recordstatus,
        ]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }


    // update notify_user==No
    public function uptNotifyUser(Request $request)
    {
        $id_program = $request->input('id_program');
        $notify_user = $request->input('notify_user');

        $obj = hep_program::where([['id_program', '=', $id_program]])->update(['notify_user' => $notify_user]);

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => "Update Success!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Update Failed!",
                'data' => ''
            ], 404);
        }
    }



    // total kira total Program ikut kategori afiez 22sep2023
    public function countbyKat(Request $request)
    {
        $prog_category_id = $request->input('prog_category_id');

        // $obj = hep_program::where('prog_category_id', 'Aktiviti Luar')->first(
        $obj = hep_program::where('prog_category_id', $prog_category_id)->first(
            [
                DB::RAW('count(distinct(id_program)) AS total')
            ]
        );




        // $count = hep_program::where('prog_category_id', $prog_category_id) ->whereYear('prog_startdate', date('Y'))->sum('prog_peruntukan');
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Show Success!',
                'data' => $obj,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "No Data!",
                'data' => ''
            ]);
        }
    }


    // total budget by month afiez 22sep2023
    public function TotalBudget(Request $request)
    {

        $prog_category_id = $request->input('prog_category_id');
        $month = $request->input('month');
        $year = $request->input('year');
        // $month = 12; 

        $obj = hep_program::query();

        if ($month) {
            // // $obj->where('prog_category_id', 'Aktiviti Luar')
            // $obj->where('prog_category_id', $prog_category_id)
            // ->whereMonth('prog_startdate', '12');
            // ->whereMonth('prog_startdate', $month);

            // dd($month);

            // // kalau ada specific tahun nanti tnya safi
            $obj->where('recordstatus', '!=', 'DEL')
                ->where('prog_category_id', $prog_category_id)
                ->whereYear('prog_startdate', $year)
                ->whereMonth('prog_startdate', $month);
        } else {
            $obj->where('recordstatus', '!=', 'DEL')
                ->where('prog_category_id', $prog_category_id)->whereYear('prog_startdate', date('Y'));

            // $obj->where('prog_category_id', 'Aktiviti Luar');
        }

        $count = $obj->sum('prog_alloc_approve');



        // $count = hep_program::where('prog_category_id', 'Aktiviti Luar')->sum('prog_peruntukan');
        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Show Success!',
                // 'data' => $obj,
                'Count' => $count
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "No Data!",
                'data' => ''
            ]);
        }
    }

    public function reportProg(Request $request)
    {

        $prog_startdate = $request->input('tarikh_mula');
        $prog_enddate = $request->input('tarikh_tamat');
        $prog_category_id = $request->input('prog_category_id');


        $obj = hep_program::where([['hep_program.recordstatus', '!=', 'DEL']])
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_program.clg_id')
            ->leftjoin('sad_users', 'sad_users.usr_id', '=', 'hep_program.user_id')
            ->orderBy('prog_startdate', 'DESC');

        // If tarikh_mula is set, filter by it.
        if ($prog_startdate) {
            $obj->where(hep_program::raw("DATE(hep_program.prog_startdate)"), '>=', $prog_startdate);
        }

        // If tarikh_tamat is set, filter by it.
        if ($prog_enddate) {
            $obj->where(hep_program::raw("DATE(hep_program.prog_enddate)"), '<=', $prog_enddate);
        }
        // If tarikh_tamat is set, filter by it.
        // If prog_category_id is set, filter by it.
        if ($prog_category_id) {
            $obj->where('hep_program.prog_category_id', $prog_category_id);
        }
        $obj_Reporting = $obj->get(
            [
                'id_program',
                'prog_title',

                'prog_startdate',
                'prog_enddate',
                'prog_venue',
                'prog_org',
                'prog_peruntukan',
                'prog_cost',
                'prog_category_id',
                'prog_alloc_approve',
                // 'hep_program.clg_id AS clgId',
                // 'clg_name',
                // 'prog_vent',
                // 'prog_advisor',

                // 'prog_proposal',
                // 'prog_cert',
                // 'prog_report',
                'prog_status',
                // 'prog_statusremark',
                // 'user_id',
                // 'user_type',
                // 'usr_name',

            ]
        );
        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj_Reporting
            ], 200);
        }
    }

    
}
