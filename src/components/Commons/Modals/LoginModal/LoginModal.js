import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class logInModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            loginError: null
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            loginError: null
        })

        const { username, password } = this.state;

        this.props.signIn(
            username,
            password
        ).then(success => {
            this.props.toggle();
        }).catch(err => {
            this.setState({
                loginError: err,
            });
            console.log(err);
        });
    }

    render() {
        let error;
        if (this.state.loginError) {
            switch (this.state.loginError.id) {
                case "INVALID_CREDENTIALS":
                    error = "La requête d'identification est incorrecte.";
                    break;
                case 'NO_USER':
                    error = "L'utilisateur n'existe pas.";
                    break;
                case "WRONG_CREDENTIALS":
                    error = "Le mot de passe et le nom d'utilisateur ne correspondent pas.";
                    break;
                default:
                    error = "Le serveur dans les Brumes est inaccessible."
                    break;
            }
        }

        return (
            <Modal toggle={this.props.toggle} isOpen={this.props.isOpen}>
                <ModalHeader toggle={this.props.toggleLogInModal}>Se connecter</ModalHeader>
                <ModalBody>
                    <div>
                        {error &&
                            <div className="alert alert-danger" role="alert">
                                <p>{error}</p>
                            </div>
                        }
                        <form id="login-form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="login-username">Nom d'utilisateur :</label>
                                <input type="text" className="form-control" value={this.state.username} onChange={this.handleInputChange} name="username" id="login-username" placeholder="Entrez un nom d'utilisateur" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="login-password">Mort de passe :</label>
                                <input type="password" className="form-control" value={this.state.passwprd} onChange={this.handleInputChange} name="password" id="login-password" placeholder="Mot de passe" />
                            </div>
                        </form>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button type="submit" form="login-form" className="btn btn-primary">Connexion</button>
                    <button type="button" className="btn btn-success">S'enregistrer</button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default logInModal;
