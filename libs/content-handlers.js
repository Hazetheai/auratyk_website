import { isOnOrAfterToday } from "./dateFns"

export function handleStreamLinks(release) {
    const props = release.properties || release
    if (!props.preSaveLinks || !props.streamLinks) {
        return release
    }
    const isReleased = isOnOrAfterToday(props.date) === 'Released'
    const releasedLinks = (props.streamLinks || []).map((link) => {
        const smartLink = (props.preSaveLinks || []).find(
            (preSave) => preSave.platform === link.platform
        )
        return { ...link, url: smartLink?.smart ? smartLink.url : link.url }
    })
    const streamLinks = isReleased ? releasedLinks : props.preSaveLinks
    return { ...release, streamLinks }
}
