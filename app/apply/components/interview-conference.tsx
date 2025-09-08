import type {
    MessageDecoder,
    MessageEncoder,
    TrackReferenceOrPlaceholder,
    WidgetState,
} from "@livekit/components-core"
import {
    isEqualTrackRef,
    isTrackReference,
    isWeb,
    log,
} from "@livekit/components-core"
import type { MessageFormatter } from "@livekit/components-react"
import {
    CarouselLayout,
    ConnectionStateToast,
    ControlBar,
    FocusLayout,
    FocusLayoutContainer,
    GridLayout,
    LayoutContextProvider,
    ParticipantTile,
    RoomAudioRenderer,
    useCreateLayoutContext,
    usePinnedTracks,
    useTracks,
} from "@livekit/components-react"
import { RoomEvent, Track } from "livekit-client"
import type * as React from "react"

/**
 * @public
 */
export interface VideoConferenceProps
    extends React.HTMLAttributes<HTMLDivElement> {
    chatMessageFormatter?: MessageFormatter
    chatMessageEncoder?: MessageEncoder
    chatMessageDecoder?: MessageDecoder
    /** @alpha */
    SettingsComponent?: React.ComponentType
}

/**
 * The `VideoConference` ready-made component is your drop-in solution for a classic video conferencing application.
 * It provides functionality such as focusing on one participant, grid view with pagination to handle large numbers
 * of participants, basic non-persistent chat, screen sharing, and more.
 *
 * @remarks
 * The component is implemented with other LiveKit components like `FocusContextProvider`,
 * `GridLayout`, `ControlBar`, `FocusLayoutContainer` and `FocusLayout`.
 * You can use these components as a starting point for your own custom video conferencing application.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <VideoConference />
 * <LiveKitRoom>
 * ```
 * @public
 */
export function InterviewConference({
    chatMessageFormatter,
    chatMessageDecoder,
    chatMessageEncoder,
    SettingsComponent,
    ...props
}: VideoConferenceProps) {
    const tracks = useTracks(
        [{ source: Track.Source.Camera, withPlaceholder: true }],
        {
            updateOnlyOn: [RoomEvent.ActiveSpeakersChanged],
            onlySubscribed: false,
        }
    )

    const layoutContext = useCreateLayoutContext()

    const focusTrack = usePinnedTracks(layoutContext)?.[0]
    const carouselTracks = tracks.filter(
        (track) => !isEqualTrackRef(track, focusTrack)
    )

    return (
        <div className="lk-video-conference" {...props}>
            {isWeb() && (
                <LayoutContextProvider value={layoutContext}>
                    <div className="lk-video-conference-inner">
                        {focusTrack ? (
                            <div className="lk-focus-layout-wrapper">
                                <FocusLayoutContainer>
                                    <CarouselLayout tracks={carouselTracks}>
                                        <ParticipantTile />
                                    </CarouselLayout>
                                    {focusTrack && (
                                        <FocusLayout trackRef={focusTrack} />
                                    )}
                                </FocusLayoutContainer>
                            </div>
                        ) : (
                            <div className="lk-grid-layout-wrapper">
                                <GridLayout tracks={tracks}>
                                    <ParticipantTile />
                                </GridLayout>
                            </div>
                        )}
                        <ControlBar
                            controls={{
                                chat: false,
                                screenShare: false,
                                leave: false,
                            }}
                            variation="minimal"
                        />
                    </div>
                </LayoutContextProvider>
            )}
            <RoomAudioRenderer />
        </div>
    )
}
