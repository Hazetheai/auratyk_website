import { isOnOrAfterToday } from "./dateFns"

export function handleStreamLinks(release) {
    if (!release || !release.preSaveLinks || !release.streamLinks) {
        return release
    }

    const isReleased = isOnOrAfterToday(release.date) === 'Released'

    const releasedLinks = release.streamLinks.map((link) => {
        const smartLink = release.preSaveLinks.find(
            (preSave) => preSave.platform === link.platform
        )
        return { ...link, url: smartLink?.smart ? smartLink.url : link.url }
    })

    const streamLinks = isReleased ? releasedLinks : release.preSaveLinks

    return { ...release, streamLinks }
}