module.exports = (config, id) => {
    return (config.stop_ids.hasOwnProperty(id)) ? config.stop_ids[id] : `${config.id_prefix}${id}`
}