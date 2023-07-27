const { Client } = require('ssh2');

const sshConfig = {
    host: 'your_server_hostname',
    port: your_ssh_port, // Default SSH port is 22
    username: 'your_ssh_username',
    password: 'your_ssh_password', // or privateKey: require('fs').readFileSync('path/to/privateKey')
};

const sshClient = new Client();

sshClient.on('ready', () => {
    console.log('SSH connection established.');

    // Now you can execute remote commands using sshClient.exec()
    sshClient.exec('ls', (err, stream) => {
        if (err) throw err;

        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code:', code, 'signal:', signal);
            sshClient.end(); // Close the SSH connection after command execution
        }).on('data', (data) => {
            console.log('STDOUT:', data.toString());
        }).stderr.on('data', (data) => {
            console.log('STDERR:', data.toString());
        });
    });
});

sshClient.on('error', (err) => {
    console.error('SSH connection error:', err.message);
});

sshClient.connect(sshConfig);