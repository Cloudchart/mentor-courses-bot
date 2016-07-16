type scenario_config = {
  id: string;
  actions: Array<action_config>;
  commands?: Array<command_config>;
}


type timeout_config = {
  timeout: integer;
  next: string;
}


type action_config = {
  label?: string;
  type: string;
  next?: string;
}


type message_action_config = {
  ...action_config
  text      : string;
}


type sleep_action_config = {
  ...action_config
  timeout: integer;  // timeout in seconds
  text?: string;     // message to user while in sleep
}


type input_action_config = {
  ...action_config;
  branch?: Map<value:string,next:string>;
  timeout?: timeout_config;
}
