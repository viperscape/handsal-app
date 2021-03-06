export class Client {
    socket;
    pin: number;
    connected = false;

    constructor (io) {
        this.socket = io;

        this.socket.on('connect', () => {
            console.log('connected');
            document.getElementById('ico-conn').style.visibility = '';
            document.getElementById('pin_display').style.visibility = '';
            this.connected = true;
        });

        this.socket.on('pin', (data) => {
            console.log(data);
            if (this.pin) { // resetting our pin from server?
                document.getElementById('connect?').style.display = '';
            }
            
            this.pin = data.pin;
            document.getElementById('pin_display').textContent = this.pin.toString();
        });
        
        this.socket.on('disconnect', () => {
            console.log('disconnected');
            document.getElementById('ico-good').style.visibility = 'hidden';
            document.getElementById('ico-conn').style.visibility = 'hidden';
            document.getElementById('input').style.visibility = 'hidden';
            document.getElementById('data').style.visibility = 'hidden';
            document.getElementById('connector').style.display = 'none';
            document.getElementById('directions').style.visibility = 'hidden';
            this.connected = false;
        });
        
        this.socket.on('bc', (data) => {
            console.log(data);
            if (data.conn) {
                document.getElementById('connector').style.display = 'none';
                document.getElementById('connect?').style.display = 'none';
                document.getElementById('ico-good').style.visibility = '';
                
                document.getElementById('input').style.visibility = '';
                
                // reshow pin now that we connected to elsewhere
                document.getElementById('directions').textContent = this.pin.toString();
            }
        });

        this.socket.on('err', (e) => {
            console.log('err: ',e);
            if (e.pin) {
                console.log('pin error')
            }
        });

        var data_list = [];
        this.socket.on('data', (data) => {
            console.log('data: ',data);
            
            if (data.text) {
                if (data_list.length > 5) { data_list.pop(); }
                data_list.unshift(data.text);
                
                document.getElementById('data').style.visibility = '';
                
                var list = document.getElementById('data_list');
                list.innerHTML = ''; 
                data_list.forEach((el) => {
                    var n = document.createElement('li');
                    n.innerHTML = el;
                    list.appendChild(n);
                });
            }
            else { console.log('unsupported data') }
        });

    }

    connect_show () {
        document.getElementById('connect?').style.display = 'none';
        document.getElementById('connector').style.display = '';
        document.getElementById('connector').style.visibility = '';
        (document.getElementById("pin_connect") as HTMLInputElement).value = '';
        document.getElementById('directions').textContent = "enter other pin";
    }

    connect_begin (inp) {
        if (!inp) {
            console.log('begin!');
            this.socket.emit('pin', { pin: this.pin });
        }
        else {
            var p:any = (document.getElementById(inp) as HTMLInputElement).value;
            p = parseInt(p);
            if (typeof p === 'number') {
                console.log('begin!');
                this.socket.emit('pin', { pin: p });
                this.pin = p;
            }
        }
    }

    send_data (inp) {
        if (!this.connected) { console.log('not connected'); return }
        
        var data = (document.getElementById(inp) as HTMLInputElement).value;
        this.socket.emit('data', {text:data});
        
        (document.getElementById(inp) as HTMLInputElement).value = '';
        document.getElementById('input_send').style.visibility = 'hidden';
        
        console.log('sent',data)
    }

}