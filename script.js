class Terminal {
    constructor () {
        // this.full_terminal = document.getElementById( 'full-terminal' );
        this.terminal = document.getElementById( 'terminal' );
        this.input = document.querySelector( '.input-field' );
        this.history = [];
        this.historyIndex = -1;
        this.setupListeners();
        this.setupClock();
        this.setupMenus();
    }

    setupListeners() {
        this.input.addEventListener( 'keydown', ( e ) => this.handleInput( e ) );
        document.querySelector( '.close' ).addEventListener( 'click', () => this.handleClose() );
        document.querySelector( '.minimize' ).addEventListener( 'click', () => this.handleMaximize() );
        document.querySelector( '.maximize' ).addEventListener( 'click', () => this.handleMaximize() );

        this.input.addEventListener( 'blur', () => {
            setTimeout( () => this.input.focus(), 10 );
        } );

        document.addEventListener( 'keydown', ( e ) => {
            if ( e.key === 'Backspace' && e.target === document.body ) {
                e.preventDefault();
            }
            if ( e.key === 'f' && ( e.ctrlKey || e.metaKey ) ) {
                e.preventDefault();
            }
        } );

        this.terminal.addEventListener( 'click', () => {
            this.input.focus();
        } );
    }

    setupMenus() {
        const panelLeft = document.querySelector( '.panel-left' );
        panelLeft.innerHTML = '';

        const activitiesButton = document.createElement( 'div' );
        activitiesButton.className = 'menu-button';
        activitiesButton.id = 'activities-button';
        activitiesButton.innerHTML = `
                    Activities
                    <div class="dropdown-menu" id="activities-menu">
                        <div class="menu-item" data-command="about">
                            <i class="material-icons">info</i> About Me
                        </div>
                        <div class="menu-item" data-command="skills">
                            <i class="material-icons">build</i> Skills
                        </div>
                        <div class="menu-item" data-command="projects">
                            <i class="material-icons">code</i> Projects
                        </div>
                        <div class="menu-item" data-command="contact">
                            <i class="material-icons">contact_mail</i> Contact
                        </div>
                    </div>
                `;

        const applicationsButton = document.createElement( 'div' );
        applicationsButton.className = 'menu-button';
        applicationsButton.id = 'applications-button';
        applicationsButton.innerHTML = `
                    Applications
                    <div class="dropdown-menu" id="applications-menu">
                        <div class="menu-item" data-command="terminal">
                            <i class="material-icons">computer</i> Terminal
                        </div>
                        <div class="menu-item" data-command="help">
                            <i class="material-icons">help_outline</i> Help
                        </div>
                        <div class="menu-item" data-command="clear">
                            <i class="material-icons">clear_all</i> Clear Terminal
                        </div>
                    </div>
                `;

        panelLeft.appendChild( activitiesButton );
        panelLeft.appendChild( applicationsButton );

        const activitiesMenu = document.getElementById( 'activities-menu' );
        const applicationsMenu = document.getElementById( 'applications-menu' );
        const overlay = document.querySelector( '.overlay' );

        // Add event listeners for menu items
        //const activitiesMenu = document.getElementById( 'activities-menu' );
        // applicationsMenu = document.getElementById( 'applications-menu' );

        activitiesMenu.addEventListener( 'click', ( e ) => {
            const menuItem = e.target.closest( '.menu-item' );
            if ( menuItem ) {
                const command = menuItem.getAttribute( 'data-command' );
                this.handleCommand( command );
            }
        } );

        applicationsMenu.addEventListener( 'click', ( e ) => {
            const menuItem = e.target.closest( '.menu-item' );
            if ( menuItem ) {
                const command = menuItem.getAttribute( 'data-command' );
                if ( command === 'terminal' ) {
                    this.openTerminal();
                } else {
                    this.handleCommand( command );
                }
            }
        } );

        const closeMenus = () => {
            activitiesMenu.classList.remove( 'show' );
            applicationsMenu.classList.remove( 'show' );
            overlay.classList.remove( 'show' );
        };

        activitiesButton.addEventListener( 'click', ( e ) => {
            e.stopPropagation();
            const isOpen = activitiesMenu.classList.contains( 'show' );
            closeMenus();
            if ( !isOpen ) {
                activitiesMenu.classList.add( 'show' );
                overlay.classList.add( 'show' );
            }
        } );

        applicationsButton.addEventListener( 'click', ( e ) => {
            e.stopPropagation();
            const isOpen = applicationsMenu.classList.contains( 'show' );
            closeMenus();
            if ( !isOpen ) {
                applicationsMenu.classList.add( 'show' );
                overlay.classList.add( 'show' );
            }
        } );

        document.addEventListener( 'click', closeMenus );
        overlay.addEventListener( 'click', closeMenus );
        activitiesMenu.addEventListener( 'click', ( e ) => e.stopPropagation() );
        applicationsMenu.addEventListener( 'click', ( e ) => e.stopPropagation() );

        document.addEventListener( 'keydown', ( e ) => {
            if ( e.key === 'Meta' || e.key === 'Super' ) {
                e.preventDefault();
                activitiesButton.click();
            }
        } );
    }

    handleCommand( command ) {
        document.querySelector( '.overlay' ).classList.remove( 'show' );
        document.querySelectorAll( '.dropdown-menu' ).forEach( menu => {
            menu.classList.remove( 'show' );
        } );

        this.input.value = command;
        const event = new KeyboardEvent( 'keydown', { key: 'Enter' } );
        this.handleInput( event );
    }

    openTerminal() {
        this.input.focus();
        document.querySelector( '.overlay' ).classList.remove( 'show' );
        document.querySelectorAll( '.dropdown-menu' ).forEach( menu => {
            menu.classList.remove( 'show' );
        } );
    }

    setupClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString( 'en-US', {
                hour: '2-digit',
                minute: '2-digit'
            } );
            document.querySelector( '.time' ).textContent = timeString;
        };
        setInterval( updateClock, 1000 );
        updateClock();
    }

    handleInput( e ) {
        if ( e.key === 'Enter' ) {
            const command = this.input.value.trim();
            if ( command ) {
                this.history.push( command );
                this.historyIndex = this.history.length;
                this.executeCommand( command );
            }
            this.input.value = '';
        } else if ( e.key === 'ArrowUp' ) {
            e.preventDefault();
            if ( this.historyIndex > 0 ) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if ( e.key === 'ArrowDown' ) {
            e.preventDefault();
            if ( this.historyIndex < this.history.length - 1 ) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        }
    }

    executeCommand( command ) {
        this.addLine( `<span class="prompt">rayees_ali@portfolio:~$</span> ${ command }` );

        const cmd = command.toLowerCase();
        const commands = {
            help: () => this.showHelp(),
            clear: () => this.clear(),
            about: () => this.showAbout(),
            skills: () => this.showSkills(),
            projects: () => this.showProjects(),
            contact: () => this.showContact(),
            terminal: () => this.showTerminal(),
            exit: () => this.handleClose()
        };

        if ( commands[cmd] ) {
            commands[cmd]();
            this.showNotification( `Executed: ${ cmd }` );
        } else {
            this.addLine( `<span class="error">Command not found: ${ cmd }</span>` );
        }
    }

    addLine( content ) {
        const line = document.createElement( 'div' );
        line.className = 'line';
        line.innerHTML = content;
        this.terminal.insertBefore( line, this.terminal.lastElementChild );
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    showHelp() {
        const help = `
                    <div class="help-menu">
                        Available commands:
                        <ul>
                            <li> help - Show this help menu. </li>
                            <li> about - Display information about me. </li>
                            <li> skills - List my technical skills. </li>
                            <li> projects - View my recent projects. </li>
                            <li> contact - Get my contact information. </li>
                            <li> clear - Clear the terminal. </li>
                            <li> exit - Close the terminal. </li>
                        </ul>
                    </div>
                `;
        this.addLine( help );
    }

    showAbout() {
        const about = `
                    <div class="project-card">
                        Senior Database Administrator
                        <ul>
                            <li> 10+ years experience in Oracle & SQL Server </li>
                            <li> Performance optimization specialist </li>
                            <li> Database security expert </li>
                            <li> High availability architect </li>
                        </ul>
                    </div>
                `;
        this.addLine( about );
    }

    showSkills() {
        const skills = `
                    <div class="skill-card">
                        Oracle Database
                        <ul>
                            <li> RAC Configuration </li>
                            <li> Performance Tuning </li>
                            <li> Data Guard </li>
                            <li> RMAN Backup/Recovery </li>
                        </ul>
                    </div>
                    <div class="skill-card">
                        SQL Server 
                        <ul>
                            <li> Always On Availability </li>
                            <li> Query Optimization </li>
                            <li> SSIS/SSRS </li>
                            <li> Performance Monitoring </li>
                        </ul>
                    </div>
                `;
        this.addLine( skills );
    }

    showProjects() {
        const projects = `
                    <div class="project-card">
                        Enterprise Migration
                        <ul>
                            <li> 10TB database migration  </li>
                            <li> Zero data loss </li>
                            <li> 99.9% uptime maintained </li>
                        </ul>
                    </div>
                    <div class="project-card">
                        Performance Optimization
                        <ul>
                            <li> 70% query performance improvement </li>
                            <li> Reduced CPU load by 40% </li>
                            <li> Optimized indexing strategy </li>
                        </ul>
                    </div>
                `;
        this.addLine( projects );
    }

    showContact() {
        const contact = `
                    <div class="project-card">
                        <ul>
                            <li> Email: idev-design@protonmail.com </li>
                            <li> GitHub: github.com/dev-design </li>
                            <li> Location: On Earth </li>
                        </ul>
                    </div>
                `;
        this.addLine( contact );
    }

    clear() {
        const inputLine = this.terminal.lastElementChild;
        this.terminal.innerHTML = '';
        this.terminal.appendChild( inputLine );
    }
    /*
        handleClose() {
            // document.body.innerHTML = '<div style="color: white; padding: 20px;">Terminal session ended.</div>';
            document.getElementById( "full-terminal" ).classList.remove( "terminal-window" );
            document.getElementById( "full-terminal" ).innerHTML = '<div style="color: white; padding: 20px;">Terminal session ended.</div>';
        }
    
        showTerminal() {
            // document.getElementById( "full-terminal" ) = this.full_terminal;
        }
    */
    openTerminal() {
        // Remove existing overlay and menu shows
        document.querySelector( '.overlay' ).classList.remove( 'show' );
        document.querySelectorAll( '.dropdown-menu' ).forEach( menu => {
            menu.classList.remove( 'show' );
        } );

        // Get the full terminal element
        const fullTerminal = document.getElementById( 'full-terminal' );

        // Add terminal window class to make it visible
        fullTerminal.classList.add( 'terminal-window' );

        // Reset the terminal content if needed
        fullTerminal.innerHTML = `
        <div class="terminal-header">
          <div class="window-buttons">
            <div class="window-button close"></div>
            <div class="window-button minimize"></div>
            <div class="window-button maximize"></div>
          </div>
          <div class="terminal-title">rayees_ali@portfolio:~</div>
        </div>
        <div class="terminal-content" id="terminal">
          <div class="line">
            <h3 class="ascii-art">RAYEES ALI <strong>DBA</strong></h3>
          </div>
          <div class="line">
            Welcome to Rayees Ali DBA's Portfolio Terminal v1.0
          </div>
          <div class="line">Type 'help' for available commands</div>
          <div class="input-line">
            <span class="prompt">rayees_ali@portfolio:~$</span>
            <input type="text" class="input-field" autofocus />
          </div>
        </div>
    `;

        // Reinitialize terminal listeners
        this.terminal = document.getElementById( 'terminal' );
        this.input = document.querySelector( '.input-field' );

        // Reattach event listeners
        this.setupListeners();

        // Focus on the input field
        this.input.focus();
    }

    // Modify handleClose method to reset terminal
    handleClose() {
        const fullTerminal = document.getElementById( 'full-terminal' );
        fullTerminal.classList.remove( 'terminal-window' );
    }
    handleMaximize() {
        if ( !document.fullscreenElement ) {
            document.documentElement.requestFullscreen().catch( err => {
                console.log( `Error attempting to enable fullscreen: ${ err.message }` );
            } );
        } else {
            document.exitFullscreen();
        }
    }

    showNotification( message ) {
        const notification = document.querySelector( '.notification' );
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout( () => {
            notification.style.display = 'none';
        }, 2000 );
    }
}

// Initialize terminal
const terminal = new Terminal();