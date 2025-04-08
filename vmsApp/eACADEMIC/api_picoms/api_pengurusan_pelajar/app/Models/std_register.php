<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class std_register extends Model
{
    protected $table = 'std_register';
    protected $fillable = [
        'std_register_id', 
        'std_nomatrik', 
        'std_nama', 
        'std_nokp',
        'std_emel',
        'std_notel',
        'std_program_id',
        'std_katalaluan',
        'std_jbayaran',
        'std_resit',
        'std_nokp_upload',
        'std_spm_upload',
        'std_stpm_upload',
        'std_diploma_upload',
        'std_ijazah_upload',
        'std_tahun_kemasukan',
        'statusrekod',
        'api_token',
        'created_at',
        'updated_at',
        'std_status_pelajar',
    ];

    protected $hidden = [
        'std_katalaluan','std_register_id','api_token'
    ];
}
