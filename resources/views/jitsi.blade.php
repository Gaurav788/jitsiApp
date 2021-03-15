<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Jitsi</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;600&display=swap" rel="stylesheet">

  <!-- Styles -->
  <style>
    html,
    body {
      background-color: #fff;
      color: #636b6f;
      font-family: 'Nunito', sans-serif;
      font-weight: 200;
      height: 100vh;
      margin: 0;
    }

    .full-height {
      height: 100vh;
    }

    .flex-center {
      align-items: center;
      display: flex;
      justify-content: center;
    }

    .position-ref {
      position: relative;
    }

    .top-right {
      position: absolute;
      right: 10px;
      top: 18px;
    }

    .content {
      text-align: center;
    }

    .title {
      font-size: 84px;
    }

    .links>a {
      color: #636b6f;
      padding: 0 25px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: .1rem;
      text-decoration: none;
      text-transform: uppercase;
    }

    .userListContainer {
      border: 2px solid #A9A9A9;
      border-radius: 5px;
      height: 100%;
    }

    .m-b-md {
      margin-bottom: 30px;
    }
  </style>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
  <script src="https://meet.jit.si/libs/lib-jitsi-meet.min.js"></script>
</head>

<body>
  <?php $data = decrypt($data); ?>

  <div class="container-fluid">
    <div class="container">
      <br />
      <div class="row">
        @if($data->role == 1)
        <div class="col-md-5">
          @else
          <div class="col-md-12">
            @endif

            <form class="form-horizontal" style="display: none;">
              <fieldset>
                <div class="form-group">
                  <label class="col-md-4 control-label" for="textinput">Tenant</label>
                  <div class="col-md-12">
                    <input id="tenantInput" name="textinput" type="text" placeholder="vpaas-magic-cookie-..." class="form-control input-md" required="true" value="{{$data->tenant}}">

                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label" for="textinput">JWT</label>
                  <div class="col-md-12">
                    <input id="tokenInput" name="textinput" type="text" placeholder="" class="form-control input-md" required="" disabled>

                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label" for="textinput">Room</label>
                  <div class="col-md-12">
                    <input id="roomInput" name="textinput" type="text" placeholder="Room Id" class="form-control input-md" required="true" value="{{$data->room}}">

                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label" for="textinput">Name</label>
                  <div class="col-md-12">
                    <input id="nameInput" name="textinput" type="text" placeholder="Your Name" class="form-control input-md" required="true" disabled>

                  </div>
                </div>
                <div class="form-group">
                  <label class="col-md-4 control-label" for="textinput">Role</label>
                  <div class="col-md-12">
                    <input id="roleInput" name="textinput" type="text" placeholder="Your Name" class="form-control input-md" required="true" disabled value="{{$data->role}}">

                  </div>
                </div>
              </fieldset>
            </form>

            <div class="col-md-12 text-center">
              <button id="goButton" type="button" name="singlebutton" class="btn btn-primary">@if($data->role == 1) Start Meeting @else Join @endif</button>
              @if($data->role == 1)
              <div class="row">
                <div class="col-md-6">
                  @endif
                  <button type='button' id='disconnectBtn' class="btn btn-danger" style="display:none">Disconnect</button>
                  @if($data->role == 1)
                </div>
                <div class="col-md-6">
                  <button type='button' id='muteAllRemoteAudioBtn' class="btn btn-primary" style="display:none">Mute/Unmute All Remote Tracks</button>
                </div>
              </div>
              @endif
            </div>
          </div>

          @if($data->role == 1)
          <div class="col-md-7">
            <div class="userListContainer col-md-12" id="usersListBox">
              <br />
              <span class="text-center">
                <h3>Joined Users</h3>
              </span>

              <br />
            </div>
          </div>
          @endif
        </div>

        <br />

        <div class="row">
          <div class="col-md-12" id="videoContainer" style="padding: 10px;border:1px dotted #696969; border-radius:10px; min-height:290px; display:none;"></div>
        </div>
      </div>

      <br />

    </div>
  </div>
</body>
<script src="{{secure_asset('example.js')}}"></script>

</html>