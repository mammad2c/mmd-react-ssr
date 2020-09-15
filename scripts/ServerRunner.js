const cluster = require('cluster');
const path = require('path');
const chokidar = require('chokidar');
const messages = require('./messages');

class ServerRunner {
  worker = null;

  watcher;

  serverPath = path.resolve('build/server.js');

  firstRun = false;

  constructor() {
    this.initialize();
  }

  initialize = () => {
    cluster.on('online', (worker) => {
      this.worker = worker;
    });

    process.stdin.on('data', (data) => {
      if (data.toString().trim() === 'rs') {
        this.restart(() => {
          messages.serverRestarted();
        });
      }
    });
  };

  start = (cb) => {
    cluster.setupMaster({
      exec: this.serverPath,
    });

    cluster.fork();

    if (!this.firstRun) {
      messages.serverFirstStart();
      messages.typeRs();
      this.firstRun = true;
    }

    if (!this.watcher) {
      this.watchForChanges();
    }

    if (typeof cb === 'function') {
      cb();
    }
  };

  restart = (cb) => {
    if (this.worker) {
      try {
        process.kill(this.worker.process.pid);
      } catch {
        // if we are here so worker already killed
      }
    }

    this.start();

    if (typeof cb === 'function') {
      cb();
    }
  };

  watchForChanges = () => {
    this.watcher = chokidar.watch(this.serverPath);

    this.watcher.on('ready', () => {
      this.watcher.on('all', () => {
        Object.keys(require.cache).forEach((id) => {
          if (/[\\/\\]server[\\/\\]/.test(id)) {
            delete require.cache[id];
          }
        });

        this.restart();
      });
    });
  };
}

module.exports = ServerRunner;
