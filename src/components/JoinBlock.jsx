import React from 'react';
import socket from '../socket';


function JoinBlock() {
    return (
      <div className="join-block">
        <input type="text" placeholder="Room ID" />
        <input type="text" placeholder="Your name" />
        <button className="btn btn-success">Join</button>
      </div>
  );
}

export default JoinBlock;