<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\hrm_emp_info;

class hrm_emp_infoController_sso extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('public');
    // }

    public function create(Request $request)
    {
        if ($request->isJson()) {
            $data = $request->json()->all();
            $check = true;
        } else {
            $check = false;
        }

        if ($check) {
            $obj = hrm_emp_info::create($data);
            if ($obj) {
                return response()->json([
                    'success' => true,
                    'messages' => 'Proses Berjaya',
                    'data' => $obj,
                ], 201);
            } else {
                return response()->json([
                    'success' => false,
                    'messages' => 'Proses Gagal',
                    'data' => '',
                ], 400);
            }
        } else {
            return $data;
        }
    }
    
    public function show($id)
    {
        $obj = hrm_emp_info::where('hrm_emp_info.emp_id', $id)
            // ->leftjoin('hrm_prm_department', 'hrm_prm_department.dep_id', '=', 'hrm_emp_info.emp_department')
            // ->leftjoin('hrm_prm_division', 'hrm_prm_division.div_id', '=', 'hrm_emp_info.emp_division')
            //     ->get(
            //         [
            //         'hrm_emp_info.emp_id AS empId',
            //         'emp_name',
            //         'emp_mobileno',
            //         'emp_email',
            //         'emp_status',
            //         'emp_substatus',
            //         'emp_icno',
            //         'emp_gender',
            //         'emp_race',
            //         'emp_religion',
            //         'emp_issuedate',
            //         'emp_issueexp',
            //         'emp_photo',
            //         'emp_department',
            //         // 'dep_description',
            //         'emp_division',
            //         // 'div_description'
            //     ]
            // );
            ->first([
                'hrm_emp_info.emp_id AS empId',
            'emp_name',
            ]);
        if ($obj) {
            return response()->json([
                'success' => true,
                'messages' => 'Data Found!',
                'data' => $obj,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'No Data Found!',
                'data' => '',
            ], 400);
        }
    }


    public function update(Request $request)
    {
        $data = $request->json()->all(); // Get all JSON data as an array

        // $data = $request->json()->all();

        // if ($request->isJson()) {
        //     $data = $request->json()->all();
        //     $check = true;
        // } else {
        //     $check = false;
        // }
       // $obj = hrm_emp_info::find($id);

    // Access individual data
    $emp_id = $data['emp_id'] ?? null;
       $obj = hrm_emp_info::where('emp_id', $emp_id)->first(['emp_id']);
       
    //    dd($data);
     

       if ($obj) {
        // Prepare data for updating
        $hrm_emp_info_data = [
            'emp_id' => $data['emp_id'] ?? null,
            'emp_ind' => $data['emp_ind'] ?? null,
            'emp_name' => $data['emp_name'] ?? null,
            'emp_icno' => $data['emp_icno'] ?? null,
            'emp_dob' => $data['emp_dob']['date_of_birth'] ?? null,
            'emp_nationality' => $data['emp_nationality'],
            'emp_substatus' =>  $data['emp_substatus'],
            'emp_gender' => $data['emp_gender'] ?? null,
            'emp_race' => $data['emp_race']?? null,
            'emp_religion' => $data['emp_religion'] ?? null,
            'emp_mobileno' => $data['emp_mobileno'] ?? null,
            'emp_email' => $data['emp_email'] ?? null,
            'emp_epf' => $data['emp_epf']?? null,
            'emp_sosco' => $data['emp_sosco'] ?? null,
            'emp_date_join' => $data['emp_date_join'] ?? null,
            'emp_date_left' => $data['emp_date_left']?? null,
            'emp_division' => $data['emp_division']?? null,
            'emp_department' => $data['emp_department'] ?? null,
            'json_data' => $data['json_data']
        ];

        // Filter out null or empty values to only update fields that are provided
        $hrm_emp_info_data = array_filter($hrm_emp_info_data, function ($value) {
            return !is_null($value) && $value !== '';
        });

        // Update the record
        $updated = hrm_emp_info::where('emp_id', $emp_id)->update($hrm_emp_info_data);
        if ( $updated) {
            return response()->json([
                'success' => true,
                'messages' => 'Proses Berjaya',
                'data' => $hrm_emp_info_data,
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'messages' => 'Proses Gagal',
                'data' => '',
            ], 400);
        }
    } else {
        return response()->json([
            'success' => false,
            'messages' => 'Rekod tidak dijumpai',
            'data' => '',
        ], 404);
    }
    }
    
}
