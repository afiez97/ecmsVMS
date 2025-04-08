<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hrm_emp_info extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    protected $table = 'hrm_emp_info';

    protected $fillable = [
        'emp_id', 'emp_ind', 'emp_name', 'emp_icno', 'emp_dob', 'emp_nationality', 'emp_gender', 'emp_race', 'emp2_religion', 
        'emp_homeno', 'emp_mobileno', 'emp_email', 'emp_marital', 'emp_passportno', 'emp_issuedate', 'emp_issueexp', 'emp_visano', 'emp_visaexpire', 
        'emp_permitno', 'emp_permitexpire', 'emp_workinghour', 'emp_status', 'emp_substatus', 'emp_epf', 'emp_socso', 'emp_taxno', /*'emp_photo',*/ 
        'emp_curr_addr1', 'emp_curr_addr2', 'emp_curr_addr3', 'emp_curr_postcode', 'emp_curr_state', 'emp_perm_addr1', 'emp_perm_addr2', 'emp_perm_addr3', 'emp_perm_postcode', 
        'emp_perm_state', 'emp_date_join', 'emp_date_left', 'emp_position', 'emp_designation', 'emp_jobgrade', 'emp_division', 'emp_department', 'emp_section', 
        'emp_report'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    // protected $hidden = [
    //     'password',
    // ];
}
