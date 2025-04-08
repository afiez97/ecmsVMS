<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_tawaran extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_std_tawaran';

    protected $fillable = [
        'id',
        'matrixNo',
        'first_name',
        'last_name',
        'gender',
        'email',
        'password',
        'address1',
        'mobile_no',
        'address2',
        'mykad',
        'first_choice',
        'second_choice',
        'address_postcode',
        'address_city',
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
        'marital',
        'religion',
        'dob',
        'mobile2',
        'address_state',
        'stpmYear',
        'stpm_PA',
        'stpm_other1',
        'stpm_other1_grade',
        'stpm_other2',
        'stpm_other2_grade',
        'stpm_other3',
        'stpm_other3_grade',
        'stpm_other4',
        'stpm_other4_grade',
        'stpm_other5',
        'stpm_other5_grade',
        'certYear',
        'certCGPA',
        'certname',
        'certInstitute',
        'intake',
        'lastupdateon',
        'lastapproveon',
        'recordstatus',
    ];

}
