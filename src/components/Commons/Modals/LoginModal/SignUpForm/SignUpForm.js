import React, { Component } from 'react'

export default class SignUpForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            gw2_account: '',
            gw2AccountError: false,
            email: '',
            emailconfirm: '',
            acceptemail: '',
            password: '',
            passwordconfirm: '',
            passwordError: false,
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            if (name === 'password') {
                this.checkPasswordStrenght();
            }
            if (name == 'gw2_account') {
                this.checkGW2Account();
            }
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { acceptemail, username, email, emailconfirm, password, passwordconfirm, gw2_account } = this.state;

        if (email !== emailconfirm) {
            return;
        }
        if (password !== passwordconfirm) {
            return;
        }
        if (!acceptemail) {
            return;
        }
        
        this.props.signUp({
            username,
            email,
            password,
            gw2_account,
        }).then(user => {
            this.props.signUpComplete();
        }).catch(err => {
            console.error(err);
        });
    }

    checkPasswordStrenght = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        this.setState({
            passwordError: this.state.password !== '' ? !passwordRegex.test(this.state.password) : false,
        });
    }

    checkGW2Account = () => {
        const gw2Regex = /^[a-zA-Z ]{1,}\.\d{4}$/;
        this.setState({
            gw2AccountError: this.state.gw2_account !== '' ? !gw2Regex.test(this.state.gw2_account) : false,
        });
    }

    render() {
        return (
            <div>
                <form id='signup-form' onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor='username'>Nom d'utilisateur :</label>
                        <input type='text' name='username' id='username' className='form-control' value={this.state.username} onChange={this.handleInputChange} required />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='gw2_account'>Nom de Compte GW2 :</label>
                        <input type='text' name='gw2_account' id='gw2_account' className='form-control' value={this.state.gw2_account} onChange={this.handleInputChange} required />
                        {this.state.gw2AccountError && 
                            <small className="form-text text-danger">Ce nom de compte n'est pas valide.</small>
                        }
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email :</label>
                        <input type='email' name='email' className='form-control' value={this.state.email} onChange={this.handleInputChange} aria-describedby="emailHelp" required />
                        <small id="emailHelp" className="form-text text-muted">Votre email ne sera pas partagée, mais est utilisée pour valider votre compte et récupérer votre mot de passe si nécessaire.</small>

                        <label htmlFor='emailconfirm'>Confirmez votre Email :</label>
                        <input type='email' name='emailconfirm' className='form-control' value={this.state.emailconfirm} onChange={this.handleInputChange} autocomplete='off' required />
                        {(this.state.email !== '' && this.state.emailconfirm !== '' && this.state.email !== this.state.emailconfirm) && 
                            <small className="form-text text-danger">Les emails ne sont pas identiques.</small>
                        }
                    </div>
                    <div class="form-group form-check">
                        <input type="checkbox" class="form-check-input" id="acceptemail" name='acceptemail' value={this.state.acceptemail} onChange={this.handleInputChange} required />
                        <label class="form-check-label" htmlFor="acceptemail">J'accepte de recevoir des email pour la gestion de mon compte.</label>
                        {!this.state.acceptemail && 
                            <small className="form-text text-danger">Afin de valider votre compte, nous avons besoin de conserver une adresse email valide.</small> 
                        }
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Mot de Passe :</label>
                        <input type='password' name='password' className='form-control' value={this.state.password} onChange={this.handleInputChange} aria-describedby="passwordHelp" required />
                        <small id="passwordHelp" className="form-text text-muted">Par mesure de précaution, il est recommandé d'utiliser un mot de passe unique.</small>
                        {this.state.passwordError && 
                            <small className="form-text text-danger">Le mot de passe est trop faible. Il doit contenir au moins huit caractères, dont une majuscule, un chiffre, et un symbole.</small>
                        }

                        <label htmlFor='passwordconfirm'>Confirmez votre Mot de Passe :</label>
                        <input type='password' name='passwordconfirm' className='form-control' value={this.state.passwordconfirm} onChange={this.handleInputChange} autocomplete='off' required />
                        {(this.state.password !== '' && this.state.passwordconfirm !== '' && this.state.password !== this.state.passwordconfirm) && 
                            <small className="form-text text-danger">Les mots de passe ne correspondent pas.</small>
                        }
                    </div>
                </form>
            </div>
        )
    }
}
