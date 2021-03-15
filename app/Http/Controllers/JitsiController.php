<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class JitsiController extends Controller
{

  private $data;


  public function __construct() {
    $this->data = (object) [
      'tenant' => 'testing',
      'room'   => '13',
      'role'   => 1
    ];
  }


  public function viewHostPage()
  {
    return view('jitsi', ['data' => Crypt::encrypt($this->data)]);
  }


  public function viewParticipantPage()
  {
    $data = $this->data;
    $data->role = 2;
    return view('jitsi', ['data' => Crypt::encrypt($this->data)]);
  }
}
