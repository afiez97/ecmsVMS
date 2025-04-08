<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hep_hostel_change;
use App\Models\hep_hostel_checkInOut;
// use DB;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;


class hep_hostel_changeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function register(Request $request)
    {
        $fk_booking = $request->input('fk_booking');
        $fk_chkInOut = $request->input('fk_chkInOut');
        $stud_id = $request->input('stud_id');
        $campus_id = $request->input('campus_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $change_reason = $request->input('change_reason');
        $change_status = $request->input('change_status');
        $recordstatus = $request->input('recordstatus');
        $date_apply = $request->input('date_apply');
        $chgStd_remark = $request->input('chgStd_remark');

        $obj = hep_hostel_change::create([
            'fk_booking' => $fk_booking,
            'fk_chkInOut' => $fk_chkInOut,
            'stud_id' => $stud_id,
            'campus_id' => $campus_id,
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'change_reason' => $change_reason,
            'change_status' => $change_status,
            'recordstatus' => $recordstatus,
            'date_apply' => $date_apply,
            'chgStd_remark' => $chgStd_remark
        ]);
      

        if ($obj) {
            if ($change_status == 'New') {
                // 
                $EmailPurpose = hep_hostel_change::where('change_id', $obj->change_id)
                    ->leftJoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_change.campus_id')
                    ->leftJoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_change.hostel_id')
                    ->leftJoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_change.block_id')
                    ->leftJoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_change.room_id')
                    ->leftJoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_change.stud_id')
                    ->select(
                        'mis_std_info.sti_name',
                        'hep_hostel_change.stud_id',
                        'mis_prm_college.clg_name',
                        'hep_hostel.hostel_name',
                        'hep_hostel_blok.block_name',
                        'hep_hostel_room.room_no',
                        'hep_hostel_change.*'
                    )
                    ->first(); // Or get() if you expect multiple results
    
                $data = array(
                    'name' => $EmailPurpose->sti_name,
                    'idStdStaff' => $EmailPurpose->stud_id,
                    'title' => 'You have received a <b>Hostel Change Application</b> according to the details below:',
                    'Hostel' => $EmailPurpose->hostel_name,
                    'Block' => $EmailPurpose->block_name,
                    'Room' => $EmailPurpose->room_no,
                    'content' => "
                      
        <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
            <tr>
                <th colspan='2'><strong>Hostel Application Details</strong></th>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Campus</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->clg_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student ID</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->stud_id}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student Name</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->sti_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Hostel</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->hostel_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Block</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->block_name}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Room</td>
                <td style='text-align: left; padding: 0 8px;'>{$EmailPurpose->room_no}</td>
            </tr>
            <tr>
                <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
                <td style='text-align: left; padding: 0 8px;'><strong>{$change_status}</strong></td>
            </tr>
        </table>
 ",
                );
                // dd($EmailPurpose);
    
                Mail::send('mail', $data, function ($message) use ($data, $EmailPurpose) {
                    // $message->to($array->std_id.'@gmail.com',  $array->std_name)->subject('Hostel Booking Application');
                    $message->to('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL')
                    // $message->to('ehepa@ucmi.edu.my', 'Hal Ehwal Pelajar')
                    ->subject('Hostel Change Application');
                    // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
                    $message->from($EmailPurpose->stud_id . '@student.ucmi.edu.my',  $EmailPurpose->sti_name);
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
                'data' => ''
            ], 400);
        }
    }



    public function show($id)
    {

        $obj = hep_hostel_change::where([
            ['hep_hostel_change.stud_id', '=', $id],
            // ['hep_hostel_change.booking_status','!=','Accept'],
            // ['hep_hostel_change.recordstatus','!=','DEL'],
        ])
            // $obj = hep_hostel_booking::where('cal_id', $id)
            ->latest()
            ->first();

        if ($obj) {
            return response()->json([
                'success' => true,
                'message' => 'Show Success!',
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Show Success!',
                'data' => 'No Data'
            ], 200);
        }
    }

    public function list()
    {
        $obj = hep_hostel_change::where([['hep_hostel_change.recordstatus', '!=', 'DEL']])
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_change.hostel_id')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel.hostel_branch')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_change.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_change.room_id')
            // ->leftjoin('hep_hostel_bed', 'hep_hostel_bed.bed_id', '=', 'hep_hostel_change.bed_id')
            ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_change.stud_id')
            ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
            ->orderByRaw("
            CASE 
                WHEN change_status = 'New' THEN 0
                ELSE 1
            END
                        ")
            ->orderBy('hep_hostel_change.change_id', 'desc') // Add this line for sorting
            ->get([
                'change_id',
                'clg_name',
                'hostel_name',
                'block_name',
                'room_no',
                // 'hep_hostel_change.bed_id AS bedId',
                // 'bed_no',
                'stud_id',
                'sti_name',
                'sti_gender_name',
                'change_reason',
                'change_status',
                'chg_remark',
                'campus_id',
                'hep_hostel_change.hostel_id AS hstlId',
                'hep_hostel_change.block_id AS blokId',
                'hep_hostel_change.room_id AS roomId',
                'hep_hostel_change.date_apply',
                'hep_hostel_change.fk_chkInOut',
                'hep_hostel_change.chgStd_remark'
            ]);

            $obj->map(function ($item) {
                // Ensure fk_chkInOut exists and is not null before proceeding
                if (isset($item->fk_chkInOut)) {
                    $oldHostelData = hep_hostel_checkInOut::select([
                        'clg_name',
                        'hostel_name',
                        'block_name',
                        'room_no',
                    ])
                        ->where('hep_hostel_chkinout.chkInOut_id', $item->fk_chkInOut)
                        ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_chkinout.stud_id')
                        ->leftjoin('mis_status', 'mis_status.sts_status_id', '=', 'mis_std_info.status_academic')
                        ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel_chkinout.branch_id')
                        ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_chkinout.hostel_id')
                        ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_chkinout.block_id')
                        ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_chkinout.room_id')
                        // ->latest()
                        ->first();
            
                    if ($oldHostelData) {
                        $item->oldHostel = $oldHostelData->clg_name . '<br>' . $oldHostelData->hostel_name . '<br>' . $oldHostelData->block_name . '<br>' . $oldHostelData->room_no;
                    } else {
                        $item->oldHostel = '';
                    }
                }
                return $item;
            });
            
            
        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // public function update(Request $request)
    // {

    //     $change_id = $request->input('change_id');
    //     $change_status = $request->input('change_status');
    //     $chg_remark = $request->input('chg_remark');
    //     $notify_std = $request->input('notify_std');
    //     $recordstatus = $request->input('recordstatus');
    //     $dataHstl = $request->input('dataHstl');

    //     $array = json_decode($dataHstl);

        
    //     $obj = hep_hostel_change::where([['change_id', '=', $change_id]])->update([
    //         'change_status' => $change_status,
    //         'chg_remark' => $chg_remark,
    //         'notify_std' => $notify_std,
    //         'recordstatus' => $recordstatus
    //     ]);

    //     if ($obj) {
    //         // return response()->json(['message' => 'Email sent successfully!']);

    //         $data = array(
    //             'name'=> $array->std_name,
    //             'idStdStaff'=> $array->std_id,
    //             'title'=> "Your <b>Hostel Change Application</b> has been updated according to the details below:",
    //             'Hostel'=> $array->hstl_name,
    //             'Block'=> $array->blok_name,
    //             'Room'=> $array->room_name,
    //             'content' => "
    
    //     <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
    //         <tr>
    //             <th colspan='2'><strong>Hostel Application Details</strong></th>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Campus</td>
    //             <td style='text-align: left; padding: 0 8px;'>{$array->campus_name}</td>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student ID</td>
    //             <td style='text-align: left; padding: 0 8px;'>{$array->std_id}</td>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Student Name</td>
    //             <td style='text-align: left; padding: 0 8px;'>{$array->std_name}</td>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Hostel</td>
    //             <td style='text-align: left; padding: 0 8px;'>{$array->hstl_name}</td>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Block</td>
    //             <td style='text-align: left; padding: 0 8px;'>{$array->blok_name}</td>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Applied Room</td>
    //             <td style='text-align: left; padding: 0 8px;'>{$array->room_name}</td>
    //         </tr>
    //         <tr>
    //             <td style='background-color: #dddddd; text-align: left; padding: 0 8px;'>Status</td>
    //             <td style='text-align: left; padding: 0 8px;'><strong>{$change_status}</strong></td>
    //         </tr>
    //     </table>

    //     ",
    //         );
          
    //         if ($change_status != 'New') {  
    //             Mail::send('mail', $data, function($message) use ($data, $array) {
    //                 // $message->to('mohdafiez7@gmail.com',  $array->std_name)->subject('Hostel Change Application');
    //                 $message->to($array->std_id.'@student.ucmi.edu.my',  $array->std_name)->subject('Hostel Change Application');
    //                 // $message->to('mohdafiez7@gmail.com', 'Test Name')->subject('Hostel Booking Application');
    //                 $message->from('hostel@ucmi.edu.my','UNIT PENGURUSAN HOSTEL');
    //                 // $message->from('ehepa@ucmi.edu.my','hepa');

    //             });          
    //         }

    //         return response()->json([
    //             'success' => true,
    //             'message' => "Update Success!",
    //             'data' => $obj
    //         ], 200);
    //     } else {
    //         return response()->json([
    //             'success' => false,
    //             'message' => "Update Failed!",
    //             'data' => ''
    //         ], 404);
    //     }
    // }

    public function update(Request $request)
{
    $change_id = $request->input('change_id');
    $change_status = $request->input('change_status');
    $chg_remark = $request->input('chg_remark');
    $notify_std = $request->input('notify_std');
    $recordstatus = $request->input('recordstatus');
    $dataHstl = $request->input('dataHstl');

    $array = json_decode($dataHstl);

    $updateResult = hep_hostel_change::where('change_id', $change_id)->update([
        'change_status' => $change_status,
        'chg_remark' => $chg_remark,
        'notify_std' => $notify_std,
        'recordstatus' => $recordstatus
    ]);

    if ($updateResult) {

        return response()->json([
            'success' => true,
            'message' => "Update Success!",
            'data' => $updateResult
        ], 200);
        
        $data = [
            'name' => $array->std_name,
            'idStdStaff' => $array->std_id,
            'title' => "Your <b>Hostel Change Application</b> has been updated according to the details below:",
            'Hostel' => $array->hstl_name,
            'Block' => $array->blok_name,
            'Room' => $array->room_name,
            'content' => "
                <table border='1' style='font-family: arial, sans-serif; border-collapse: collapse; width: 100%;'>
                    <tr>
                        <th colspan='2'><strong>Hostel Application Details</strong></th>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Campus</td>
                        <td style='text-align: left; padding: 8px;'>{$array->campus_name}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Student ID</td>
                        <td style='text-align: left; padding: 8px;'>{$array->std_id}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Student Name</td>
                        <td style='text-align: left; padding: 8px;'>{$array->std_name}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Applied Hostel</td>
                        <td style='text-align: left; padding: 8px;'>{$array->hstl_name}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Applied Block</td>
                        <td style='text-align: left; padding: 8px;'>{$array->blok_name}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Applied Room</td>
                        <td style='text-align: left; padding: 8px;'>{$array->room_name}</td>
                    </tr>
                    <tr>
                        <td style='background-color: #dddddd; text-align: left; padding: 8px;'>Status</td>
                        <td style='text-align: left; padding: 8px;'><strong>{$change_status}</strong></td>
                    </tr>
                </table>
            ",
        ];

        if ($change_status != 'New') {
            Mail::send('mail', $data, function($message) use ($data, $array) {
                $message->to("{$array->std_id}@student.ucmi.edu.my", $array->std_name)
                    ->subject('Hostel Change Application');
                $message->from('hostel@ucmi.edu.my', 'UNIT PENGURUSAN HOSTEL');
            });
        }

        // return response()->json([
        //     'success' => true,
        //     'message' => "Update Success!",
        //     'data' => $updateResult
        // ], 200);
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
        $change_id = $request->input('change_id');

        $obj = hep_hostel_change::where('change_id', $change_id)->update([
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


    // alert status==New
    public function alertChgNew()
    {
        $obj = hep_hostel_change::where([['recordstatus', '!=', 'DEL'], ['change_status', '=', 'New']])->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // alert status==Verify
    public function alertChngVerify()
    {
        $obj = hep_hostel_change::where([['recordstatus', '!=', 'DEL'], ['change_status', '=', 'Verify']])->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // alert status==Accept
    public function alertChngAccept()
    {
        $obj = hep_hostel_change::where([['recordstatus', '!=', 'DEL'], ['change_status', '=', 'Accept']])->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // alert status==Reject
    public function alertChngRjct()
    {
        $obj = hep_hostel_change::where([['recordstatus', '!=', 'DEL'], ['change_status', '=', 'Reject']])->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // alert status==Verify
    public function alertChgVrfy()
    {
        $obj = hep_hostel_change::where([['recordstatus', '!=', 'DEL'], ['change_status', '=', 'Verify']])->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // alert status==Complete
    public function alertChgCmplt()
    {
        $obj = hep_hostel_change::where([['recordstatus', '!=', 'DEL'], ['change_status', '=', 'Complete']])->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    public function listByStd($id)
    {
        $obj = hep_hostel_change::SELECT('hep_hostel_change.*', 'hostel_branch', 'hostel_name', 'clg_name', 'block_name', 'room_no', 'bed_no')
            ->leftjoin('hep_hostel', 'hep_hostel.hostel_id', '=', 'hep_hostel_change.hostel_id')
            ->leftjoin('mis_prm_college', 'mis_prm_college.pk_id', '=', 'hep_hostel.hostel_branch')
            ->leftjoin('hep_hostel_blok', 'hep_hostel_blok.block_id', '=', 'hep_hostel_change.block_id')
            ->leftjoin('hep_hostel_room', 'hep_hostel_room.room_id', '=', 'hep_hostel_change.room_id')
            ->leftjoin('hep_hostel_bed', 'hep_hostel_bed.bed_id', '=', 'hep_hostel_change.bed_id')
            ->where([['hep_hostel_change.stud_id', '=', $id], ['hep_hostel_change.recordstatus', '!=', 'DEL']])
            ->orderBy('hep_hostel_change.lastupdateon')
            ->get();

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update by student
    public function uptByStd(Request $request)
    {
        $change_id = $request->input('change_id');
        $hostel_id = $request->input('hostel_id');
        $block_id = $request->input('block_id');
        $room_id = $request->input('room_id');
        $campus_id = $request->input('campus_id');
        $change_reason = $request->input('change_reason');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_change::where([['change_id', '=', $change_id]])->update([
            'hostel_id' => $hostel_id,
            'block_id' => $block_id,
            'room_id' => $room_id,
            'campus_id' => $campus_id,
            'change_reason' => $change_reason,
            'recordstatus' => $recordstatus
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


    // update status by warden
    public function uptStatus(Request $request)
    {
        $change_id = $request->input('change_id');
        $change_status = $request->input('change_status');
        $recordstatus = $request->input('recordstatus');

        $obj = hep_hostel_change::where([['change_id', '=', $change_id]])->update([
            'change_status' => $change_status,
            'recordstatus' => $recordstatus
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


    // 
    public function chkChgStd(Request $request)
    {
        $fk_chkInOut = $request->input('fk_chkInOut');
        $stud_id = $request->input('stud_id');

        $obj = hep_hostel_change::where([['fk_chkInOut', '=', $fk_chkInOut], ['stud_id', '=', $stud_id]]) // 27 nov 2023 afiez
            ->where('booking_status', '=', 'Reject')
            ->get(['change_id']);

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


    // notify student status==Reject && notify_std==Yes
    public function notifyStdReject($id)
    {
        $obj = hep_hostel_change::where([
            ['stud_id', '=', $id],
            ['recordstatus', '!=', 'DEL'],
            ['change_status', '=', 'Reject'],
            ['notify_std', '=', 'Yes']
        ])
            ->get(['change_id']);

        if ($obj) {
            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $obj
            ], 200);
        }
    }


    // update student notify_std==No
    public function uptNotifyStd($id)
    {
        $obj = hep_hostel_change::where([['change_id', '=', $id]])->update(['notify_std' => 'No']);

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



    // join info student utk tau jantina 
    // untuk generate table reporting PDF
    public function reportingChangehstl(Request $request)

    {
        $chgDate = $request->input('chgDate');
        if ($chgDate)
        {
            $dateParts = explode('-', $chgDate);
            $year = $dateParts[0];
            $month = $dateParts[1];
        }
        else{
            $year = null;
            $month = null; 
        }

        $obj = hep_hostel_change::select(
            'hep_hostel_change.change_id',
            'hep_hostel_change.stud_id',
            'mis_std_info.sti_name',
            'mis_gender.sti_gender_name',
            'hep_hostel_change.change_reason',
            'hep_hostel_change.change_status',
            'hep_hostel_change.date_apply'
        )
        ->leftjoin('mis_std_info', 'mis_std_info.std_studentid', '=', 'hep_hostel_change.stud_id')
        ->leftjoin('mis_gender', 'mis_gender.sti_gender_id', '=', 'mis_std_info.sti_gender')
        ->where('hep_hostel_change.recordstatus', '!=', 'DEL');
        
        if ($month) {
            $obj->whereMonth('hep_hostel_change.date_apply', '=', $month);
        }
        
        if ($year) {
            $obj->whereYear('hep_hostel_change.date_apply', '=', $year);
        }
        
        $obj = $obj->orderBy('hep_hostel_change.change_id', 'desc')->get();
        
    

        if ($obj) {
            // Use the groupBy and count methods to count occurrences of change_reason
            $counts = $obj->groupBy('change_reason')->map(function ($group) {
                return $group->groupBy('sti_gender_name')->map->count();
            });

            return response()->json([
                'success' => 'true',
                'message' => 'List Success!',
                'data' => $counts,
                // 'data' => $obj,
                // 'change_reason_counts' => $counts, // Add the counts to your response
            ], 200);
        }
    }


    public function verifyroom($block_id, $room_id)
    {

        $obj = DB::table('hep_hostel_room as h1')
            ->select('h1.room_id', 'h1.room_no', 'h1.total_bed', DB::raw('CONVERT(COALESCE(k.total_occupied, 0), UNSIGNED) AS total_occupied'))
            ->leftJoin(DB::raw('
                (SELECT h2.room_id,
                        SUM(CASE WHEN h2.checkIn_status IS NOT NULL THEN 1 ELSE 0 END) AS total_occupied
                FROM hep_hostel_chkinout AS h2
                WHERE h2.checkIn_status != "Check Out"
                    AND h2.recordstatus != "DEL"
                GROUP BY h2.room_id) AS k
            '), 'h1.room_id', '=', 'k.room_id')
            ->where('h1.block_id', $block_id)
            ->where('h1.room_id', $room_id)
            ->where('h1.recordstatus', '!=', 'DEL')
            ->where('h1.room_status', 'Active')
            ->whereRaw('h1.total_bed > COALESCE(k.total_occupied, 0)')
            ->get();


        // if($obj){
        //     return response()->json([
        //         'success'=>true,
        //         'message'=>"Update Success!",
        //         'data' => $obj
        //     ],200);
        // }
        // else{
        //     return response()->json([
        //         'success'=>false,
        //         'message'=>"Update Failed!",
        //         'data'=>''
        //     ],404);
        // }
        // if(sizeof($obj)>0){
        //     return response()->json([
        //         'success'=>true,
        //         'message'=>"Carian Berjaya!",
        //         'data' => $obj
        //     ],200);
        // }
        // else{
        //     return response()->json([
        //         'success'=>false,
        //         'message'=>"Requested Room Full",
        //         'data'=>''
        //     ],400);
        // }

        if (sizeof($obj) > 0) {
            return response()->json([
                'success' => true,
                'message' => "Carian Berjaya!",
                'data' => $obj
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => "Carian Gagal!",
                'data' => ''
            ], 400);
        }
    }
}
