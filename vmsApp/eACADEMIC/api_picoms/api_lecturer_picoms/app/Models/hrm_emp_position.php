<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hrm_emp_position extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'hrm_emp_position';

    protected $fillable = [
        'Id',
        'Emp_Id',
        'Pos_Id',
        'Job_Code',
        'Div_Id',
        'Dep_Id',
        'Sec_Id',
        'Report_To',
        'Date_Join',
        'Date_Left',
        'Pos_Status'
    ];
}
