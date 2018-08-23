import React, { Component } from 'react';

class CharacterDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            character: null,
        };
    }

    componentDidMount = () => {
        this.props.charactersService.fetchOne(this.props.selected).then(character => {
            this.setState({ character });
        });
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.selected !== this.props.selected) {
            this.setState({
                character: null,
            });
    
            this.props.charactersService.fetchOne(this.props.selected).then(character => {
                this.setState({ character });
            });
            return true;
        }
        return false;
    }

    render() {
        const { selected } = this.props;
        const { character } = this.state;

        if (!character) {
            return (
                <div>
                    Loading.
                </div>
            )
        }

        const { name, description, owner } = character;

        return (
            <div>
                <h1>{name}</h1>
            </div>
        );
    }
}

export default CharacterDetails;
