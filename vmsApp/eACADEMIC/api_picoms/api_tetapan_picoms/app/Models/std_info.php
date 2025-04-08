<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class std_info extends Model
{
    protected $table = 'std_info';
    protected $fillable = [
        'id', 
        'first_name', 
        'last_name',
        'gender',
        'email',
        'password',
        'address1',
        'address2',
        'address_postcode',
        'address_city',
        'address_state',
        'mobile_no',
        'mobile2',
        'mykad',
        'first_choice',
        'second_choice',
        'school_name',
        'acad_year',
        'aggregate',
        'GRED_BM',
        'GRED_BI',
        'GRED_MATH',
        'GRED_SEJARAH',
        'GRED_ISLAM',
        'GRED_OTHER1',
        'GRED_OTHER2',
        'GRED_OTHER3',
        'GRED_OTHER4',
        'GRED_OTHER5',
        'SUB_OTHER1',
        'SUB_OTHER2',
        'SUB_OTHER3',
        'SUB_OTHER4',
        'SUB_OTHER5',
        'status',
        'offer_choice',
        'image',
        'datetime',
        'email_datetime',
        'introducer',
        'country',
        'ethnic',
        'bumiputera',
        'status_oku',
        'marital',
        'religion',
        'dob', 
        'bank_name', 
        'bank_accno', 
        'stpmYear',
        'stpm_PA',
        'stpm_other1',
        'stpm_other2',
        'stpm_other3',
        'stpm_other4',
        'stpm_other5',
        'stpm_other1_gra',
        'stpm_other2_gra',
        'stpm_other3_gra',
        'stpm_other4_gra',
        'stpm_other5_gra',
        'certYear',
        'certCGPA',
        'certname',
        'certInstitute',
        'intake',
        'matricno',
        'api_token',
        'statusrekod',
        'std_father_name',
        'std_father_mykad',
        'std_father_address',
        'std_father_mobile_no',
        'std_father_job',
        'std_mother_name',
        'std_mother_mykad',
        'std_mother_address',
        'std_mother_mobile_no',
        'std_mother_job',
        'std_waris_name',
        'std_waris_address',
        'std_waris_mobile_no',
        'std_waris_relation',
        'std_pendapatan',
        'std_duduk_bersama',
        'std_jum_tanggungan',
    ];

    protected $hidden = [
        'password','api_token'
    ];
}
