<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class hep_aduanResponden extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */

    // const UPDATED_AT = 'lastupdateon';
    // const CREATED_AT = 'lastapproveon';

    protected $table = 'hep_aduanResponden';
    protected $primaryKey = 'pk_id';

    protected $fillable = [
        'pk_id', 'FK_jenisaduanHostel', 'FK_idStudent', 'aduan_rujukan', 'aduan_status',
        'aduan_warden_assigned', 'aduan_details', 'aduan_date', 'aduan_warden_remark', 'aduan_upload', 'aduan_alert',
        'FK_clg', 'FK_block', 'FK_hostel', 'FK_room', 
       
        'updated_at', 'created_at', 
        'lastupdateby','lastapproveby', 
        'recordstatus'
    ];
    

    // protected $hidden = [
    //     'recordstatus',
    // ];
}
