const Players = require('../models/player')
const Nations = require('../models/nation')

let positionData = [{
        "id": "1",
        "name": "Goalkeeper"
    },
    {
        "id": "2",
        "name": "Midfielder"
    },
    {
        "id": "3",
        "name": "Right Backs"
    },
    {
        "id": "4",
        "name": "Left Backs"
    },
    {
        "id": "8",
        "name": "Wingers"
    },
]

class PlayerController {
    async index(req, res, next) {
        var players = await Players.find();
        var nations = await Nations.find();

        res.render('players', {
            title: 'Players',
            players: players,
            nations: nations,
            positionList: positionData,
            button: req.isAuthenticated() ? 'Logout' : 'Login',
            isAdmin: req.user.isAdmin ? '' : 'hidden',
        });
    }

    create(req, res, next) {
        const player = new Players(req.body);
        player.save()
            .then(() => res.redirect('/players'))
            .catch(error => {});
    }

    formEdit(req, res, next) {
        const playerId = req.params.playerId;
        Players.findById(playerId)
            .then((player) => {
                Nations.find({}).then((nations) => {
                    res.render('editPlayer', {
                        title: 'The detail of Player',
                        player: player,
                        nations: nations,
                        positionList: positionData
                    })
                })
            })
            .catch(next);
    }

    edit(req, res, next) {
        Players.updateOne({
                _id: req.params.playerId
            }, req.body)
            .then(() => {
                res.redirect('/players')
            })
            .catch(next)
    }

    delete(req, res, next) {
        Players.deleteOne({
                _id: req.params.playerId
            }, req.body)
            .then(() => {
                res.redirect('/players')
            })
            .catch(next)
    }
}
module.exports = new PlayerController;