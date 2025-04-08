<?php

namespace App\Models;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class mis_std_curAcademic extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';

    protected $table = 'mis_std_curAcademic';

    protected $fillable = [
        'pk_cur_academic',
        'fk_acaCal',
        'std_studentid',
        'std_semester',
        'curAcademic_type',
        'std_duration_study',
        'std_admission',
        'std_completion',
        'std_mentor',
        'std_senate_endorsement',
        'std_remarks',
        'std_release',
        'std_gpa',
        'std_cgpa',
        'tcp',
        'tgp',
        'tc',
        'std_cect',
        'std_total_cect',
        'std_total_credit',
        'std_total_hour',
        'std_warning_letter1',
        'std_warning_letter2',
        'std_warning_letter3',
        'std_barred_letter',
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
        'acaCal_weeks',
    ];
}
