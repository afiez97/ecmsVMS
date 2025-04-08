<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class picoms_cte_stdFeedback extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;
    const UPDATED_AT = 'lastupdateon';
    const CREATED_AT = 'lastapproveon';


    protected $primaryKey = 'pk_cte_feedback';
    protected $table = 'picoms_cte_stdFeedback';
    protected $fillable = [
        'pk_cte_feedback',
        'std_studentid',
        'fk_cte_question',
        'feedback_std',
        'fk_cotDet',
        'emp_id',
        'aca_session',
        'fk_crs',
        'fk_rsb',
        
        'lastupdateon',
        'lastupdateby',
        'lastapproveon',
        'lastapproveby',
        'recordstatus',
    ];
}
