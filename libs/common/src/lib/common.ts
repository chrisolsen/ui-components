export type GoABSpinnerType = "infinite" | "progress";
export type GoABSpinnerSize = "small" | "medium" | "large" | "xlarge";

export type GoABRadioGroupOnChangeDetail = {
  name: string;
  value: string;
}

export type GoABInputOnChangeDetail<T = string> = {
  name: string;
  value: T;
}
export type GoABInputOnFocusDetail<T = string> = GoABInputOnChangeDetail<T>;
export type GoABInputOnBlurDetail<T = string> = GoABInputOnChangeDetail<T>;

export type GoABInputOnKeyPressDetail<T = string> = {
  name: string;
  value: T;
  key: T;
}

export type GoABFormStepperOnChangeDetail = {
  step: number;
}

export type GoABFileUploadInputOnSelectFileDetail = {
  file: File;
}

export type GoABFileUploadOnCancelDetail = {
  filename: string;
}

export type GoABFileUploadOnDeleteDetail = {
  filename: string;
}

export type GoABDropdownOnChangeDetail = {
  name?: string;
  value?: string;
  values?: string[];
}

export type GoABDatePickerOnChangeDetail = {
  name?: string;
  value: string | Date;
}

export type GoABChipVariant = "filter";

export type GoABCheckboxOnChangeDetail = {
  name?: string;
  value?: string;
  checked: boolean;
}

export type GoABCalendarOnChangeDetail = {
  name?: string;
  value: string;
}


export type GoABBadgeType =
  | "information"
  | "success"
  | "important"
  | "emergency"
  | "dark"
  | "midtone"
  | "light";

export type GoABPaginationVariant = "all" | "links-only";

export type GoABFormStepperType = "constrained" | "free";
export type GoABFormStepStatus = "complete" | "incomplete" | "unstarted";

// Formitem
export type GoABFormItemLabelSize = "regular" | "large";
export type GoABFormItemRequirement = "optional" | "required";

// FIle upload
export type GoABFileUploadInputVariant = "dragdrop" | "button";

// Container
export type GoABContainerType = "interactive" | "info" | "error" | "success" | "important";
export type GoABContainerAccent = "thick" | "thin" | "filled";
export type GoABContainerPadding = "relaxed" | "compact";

// Callout
export type GoABCalloutType = "information" | "success" | "important" | "emergency" | "event";
export type GoABCalloutSize = "medium" | "large";

// Button
export type GoABButtonType =
  | "primary"
  | "submit"
  | "secondary"
  | "tertiary"
  | "start";

export type GoABButtonSize = "compact" | "normal";
export type GoABButtonVariant = "normal" | "destructive";

// Button group
export type GoABButtonGroupAlignment = "start" | "end" | "center";
export type GoABButtonGroupGap = "relaxed" | "compact";

// Accordion
export type GoABAccordionHeadingSize = "small" | "medium";

// Formstepper

// Tooltip

export type GoABTooltipPosition = "top" | "bottom" | "left" | "right";
export type GoABTooltipHorizontalAlignment = "left" | "right" | "center";

// Textarea

export type GoABTextAreaCountBy = "character" | "word";

// Tabs

export interface GoABTabsProps {
  initialTab?: number;
}

export interface GoABTabItemProps {
  // heading?: ; slot
}

// Table

export type GoABTableVariant = "normal" | "relaxed";
export interface GoABTableProps extends Margins {
  width?: string;
  onSort?: (sortBy: string, sortDir: number) => void;
  variant?: GoABTableVariant;
  testId?: string;
}

// Spacer

export type GoABSpacerHorizontalSpacing = Spacing | "fill"
export type GoABSpacerVerticalSpacing = Spacing;

export interface GoABSpacerProps {
  hSpacing?: Spacing | "fill";
  vSpacing?: Spacing;
  testId?: string;
}

// Skeleton

export interface GoABSkeletonProps extends Margins {
  maxWidth?: string;
  size?: GoABSkeletonSize;
  lineCount?: number;
  type: GoABSkeletonType;
  testId?: string;
}

export type GoABSkeletonType =
  | "image"
  | "text"
  | "title"
  | "text-small"
  | "avatar"
  | "header"
  | "paragraph"
  | "thumbnail"
  | "card"
  | "profile"
  | "article";

export type GoABSkeletonSize = 1 | 2 | 3 | 4;

// Radio

export type GoABRadioGroupOrientation = "horizontal" | "vertical";

export interface GoABRadioGroup extends Margins {
  name: string;
  value?: string;
  disabled?: boolean;
  orientation?: GoABRadioGroupOrientation;
  testId?: string;
  error?: boolean;
  ariaLabel?: string;
}

export interface GoABRadioItem {
  value?: string;
  label?: string;
  name?: string;
  // description?: string | React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  error?: boolean;
  testId?: string;
}

// Progress

export type GoABCircularProgressVariant = "fullscreen" | "inline";
export type GoABCircularProgressSize = "small" | "large";

// Popover

export type GoABPopoverPosition = "above" | "below" | "auto";

export interface GoABPopoverProps extends Margins {
  testId?: string;
  maxWidth?: string;
  padded?: boolean;
  position?: GoABPopoverPosition;
  relative?: boolean;
}

// Notification

export type GoABNotificationType =
  | "important"
  | "information"
  | "event"
  | "emergency";

export type GoABAriaLiveType = "polite" | "assertive" | "off";

// Microsite Header

export type GoABServiceLevel = "alpha" | "beta" | "live";
export type GoABLinkTarget = "self" | "blank";

// Modal
export type GoABModalRole = "dialog" | "alertdialog";
export type GoABModalTransition = "fast" | "slow" | "none";
export type GoABModalCalloutVariant =
  | "information"
  | "important"
  | "emergency"
  | "success"
  | "event";

// Input

export type GoABDate = Date | string;
export type GoABInputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "date"
  | "datetime-local"
  | "month"
  | "range"
  | "search"
  | "tel"
  | "time"
  | "url"
  | "week";

export type GoABAutoCapitalize =
  | "on"
  | "off"
  | "none"
  | "sentences"
  | "words"
  | "characters";


export type OnChange<T = string> = (name: string, value: T) => void;
export type OnFocus<T = string> = (name: string, value: T) => void;
export type OnBlur<T = string> = (name: string, value: T) => void;
export type OnKeyPress<T = string> = (name: string, value: T, key: string) => void;

export interface GoABInputProps extends BaseProps {
  onChange: OnChange<string>;
  value?: string;
  min?: number | string;
  max?: number | string;
  step?: number;
  onFocus?: OnFocus<string>;
  onBlur?: OnBlur<string>;
  onKeyPress?: OnKeyPress<string>;
}

export interface GoABNumberInputProps extends BaseProps {
  onChange: OnChange<number>;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onFocus?: OnFocus<number>;
  onBlur?: OnBlur<number>;
  onKeyPress?: OnKeyPress<number>;
}

export interface GoABDateInputProps extends BaseProps {
  onChange: OnChange<GoABDate>;
  value?: GoABDate;
  min?: GoABDate;
  max?: GoABDate;
  step?: number;
  onFocus?: OnFocus<GoABDate>;
  onBlur?: OnBlur<GoABDate>;
  onKeyPress?: OnKeyPress<GoABDate>;
}

interface BaseProps extends Margins {
  // required
  name: string;

  // optional
  id?: string;
  debounce?: number;
  disabled?: boolean;
  autoCapitalize?: GoABAutoCapitalize;
  placeholder?: string;
  leadingIcon?: GoABIconType;
  trailingIcon?: GoABIconType;
  onTrailingIconClick?: () => void;
  variant?: "goa" | "bare";
  focused?: boolean;
  readonly?: boolean;
  error?: boolean;
  width?: string;
  prefix?: string;
  suffix?: string;
  testId?: string;
  ariaLabel?: string;
  maxLength?: number;
}

// Icon

export type GoABIconFilledType = `${GoABIconType}-${GoABIconTheme}`;
export type GoABIconType =
  | "accessibility"
  | "add-circle"
  | "add"
  | "airplane"
  | "alarm"
  | "albums"
  | "alert-circle"
  | "alert"
  | "american-football"
  | "analytics"
  | "aperture"
  | "apps"
  | "archive"
  | "arrow-back-circle"
  | "arrow-back"
  | "arrow-down-circle"
  | "arrow-down"
  | "arrow-forward-circle"
  | "arrow-forward"
  | "arrow-redo-circle"
  | "arrow-redo"
  | "arrow-undo-circle"
  | "arrow-undo"
  | "arrow-up-circle"
  | "arrow-up"
  | "at-circle"
  | "at"
  | "attach"
  | "backspace"
  | "bag-add"
  | "bag-check"
  | "bag-handle"
  | "bag"
  | "bag-remove"
  | "balloon"
  | "ban"
  | "bandage"
  | "bar-chart"
  | "barbell"
  | "barcode"
  | "baseball"
  | "basket"
  | "basketball"
  | "battery-charging"
  | "battery-dead"
  | "battery-full"
  | "battery-half"
  | "beaker"
  | "bed"
  | "beer"
  | "bicycle"
  | "bluetooth"
  | "boat"
  | "body"
  | "bonfire"
  | "book"
  | "bookmark"
  | "bookmarks"
  | "bowling-ball"
  | "briefcase"
  | "browsers"
  | "brush"
  | "bug"
  | "build"
  | "bulb"
  | "bus"
  | "business"
  | "cafe"
  | "calculator"
  | "calendar-clear"
  | "calendar-number"
  | "calendar"
  | "call"
  | "camera"
  | "camera-reverse"
  | "car"
  | "car-sport"
  | "card"
  | "caret-back-circle"
  | "caret-back"
  | "caret-down-circle"
  | "caret-down"
  | "caret-forward-circle"
  | "caret-forward"
  | "caret-up-circle"
  | "caret-up"
  | "cart"
  | "cash"
  | "cellular"
  | "chatbox-ellipses"
  | "chatbox"
  | "chatbubble-ellipses"
  | "chatbubble"
  | "chatbubbles"
  | "checkbox"
  | "checkmark-circle"
  | "checkmark-done-circle"
  | "checkmark-done"
  | "checkmark"
  | "chevron-back-circle"
  | "chevron-back"
  | "chevron-down-circle"
  | "chevron-down"
  | "chevron-forward-circle"
  | "chevron-forward"
  | "chevron-up-circle"
  | "chevron-up"
  | "clipboard"
  | "close-circle"
  | "close"
  | "cloud-circle"
  | "cloud-done"
  | "cloud-download"
  | "cloud-offline"
  | "cloud"
  | "cloud-upload"
  | "cloudy-night"
  | "cloudy"
  | "code-download"
  | "code"
  | "code-slash"
  | "code-working"
  | "cog"
  | "color-fill"
  | "color-filter"
  | "color-palette"
  | "color-wand"
  | "compass"
  | "construct"
  | "contract"
  | "contrast"
  | "copy"
  | "create"
  | "crop"
  | "cube"
  | "cut"
  | "desktop"
  | "diamond"
  | "dice"
  | "disc"
  | "document-attach"
  | "document-lock"
  | "document"
  | "document-text"
  | "documents"
  | "download"
  | "duplicate"
  | "ear"
  | "earth"
  | "easel"
  | "egg"
  | "ellipse"
  | "ellipsis-horizontal-circle"
  | "ellipsis-horizontal"
  | "ellipsis-vertical-circle"
  | "ellipsis-vertical"
  | "enter"
  | "exit"
  | "expand"
  | "extension-puzzle"
  | "eye-off"
  | "eye"
  | "eyedrop"
  | "fast-food"
  | "female"
  | "file-tray-full"
  | "file-tray"
  | "file-tray-stacked"
  | "filenames.ps1"
  | "film"
  | "filter-circle"
  | "filter"
  | "finger-print"
  | "fish"
  | "fitness"
  | "flag"
  | "flame"
  | "flash-off"
  | "flash"
  | "flashlight"
  | "flask"
  | "flower"
  | "folder-open"
  | "folder"
  | "football"
  | "footsteps"
  | "funnel"
  | "game-controller"
  | "gift"
  | "git-branch"
  | "git-commit"
  | "git-compare"
  | "git-merge"
  | "git-network"
  | "git-pull-request"
  | "glasses"
  | "globe"
  | "golf"
  | "grid"
  | "hammer"
  | "hand-left"
  | "hand-right"
  | "happy"
  | "hardware-chip"
  | "headset"
  | "heart-circle"
  | "heart-dislike-circle"
  | "heart-dislike"
  | "heart-half"
  | "heart"
  | "help-buoy"
  | "help-circle"
  | "help"
  | "home"
  | "hourglass"
  | "ice-cream"
  | "id-card"
  | "image"
  | "images"
  | "infinite"
  | "information-circle"
  | "information"
  | "invert-mode"
  | "journal"
  | "key"
  | "keypad"
  | "language"
  | "laptop"
  | "layers"
  | "leaf"
  | "library"
  | "link"
  | "list-circle"
  | "list"
  | "locate"
  | "location"
  | "lock-closed"
  | "lock-open"
  | "log-in"
  | "log-out"
  | "magnet"
  | "mail-open"
  | "mail"
  | "mail-unread"
  | "male-female"
  | "male"
  | "man"
  | "map"
  | "medal"
  | "medical"
  | "medkit"
  | "megaphone"
  | "menu"
  | "mic-circle"
  | "mic-off-circle"
  | "mic-off"
  | "mic"
  | "moon"
  | "move"
  | "musical-note"
  | "musical-notes"
  | "navigate-circle"
  | "navigate"
  | "newspaper"
  | "notifications-circle"
  | "notifications-off-circle"
  | "notifications-off"
  | "notifications"
  | "nuclear"
  | "nutrition"
  | "open"
  | "options"
  | "paper-plane"
  | "partly-sunny"
  | "pause-circle"
  | "pause"
  | "paw"
  | "pencil"
  | "people-circle"
  | "people"
  | "person-add"
  | "person-circle"
  | "person"
  | "person-remove"
  | "phone-landscape"
  | "phone-portrait"
  | "pie-chart"
  | "pin"
  | "pint"
  | "pizza"
  | "planet"
  | "play-back-circle"
  | "play-back"
  | "play-circle"
  | "play-forward-circle"
  | "play-forward"
  | "play"
  | "play-skip-back-circle"
  | "play-skip-back"
  | "play-skip-forward-circle"
  | "play-skip-forward"
  | "podium"
  | "power"
  | "pricetag"
  | "pricetags"
  | "print"
  | "prism"
  | "pulse"
  | "push"
  | "qr-code"
  | "radio-button-off"
  | "radio-button-on"
  | "radio"
  | "rainy"
  | "reader"
  | "receipt"
  | "recording"
  | "refresh-circle"
  | "refresh"
  | "reload-circle"
  | "reload"
  | "remove-circle"
  | "remove"
  | "reorder-four"
  | "reorder-three"
  | "reorder-two"
  | "repeat"
  | "resize"
  | "restaurant"
  | "return-down-back"
  | "return-down-forward"
  | "return-up-back"
  | "return-up-forward"
  | "ribbon"
  | "rocket"
  | "rose"
  | "sad"
  | "save"
  | "scale"
  | "scan-circle"
  | "scan"
  | "school"
  | "search-circle"
  | "search"
  | "send"
  | "server"
  | "settings"
  | "shapes"
  | "share"
  | "share-social"
  | "shield-checkmark"
  | "shield-half"
  | "shield"
  | "shirt"
  | "shuffle"
  | "skull"
  | "snow"
  | "sparkles"
  | "speedometer"
  | "square"
  | "star-half"
  | "star"
  | "stats-chart"
  | "stop-circle"
  | "stop"
  | "stopwatch"
  | "storefront"
  | "subway"
  | "sunny"
  | "swap-horizontal"
  | "swap-vertical"
  | "sync-circle"
  | "sync"
  | "tablet-landscape"
  | "tablet-portrait"
  | "telescope"
  | "tennisball"
  | "terminal"
  | "text"
  | "thermometer"
  | "thumbs-down"
  | "thumbs-up"
  | "thunderstorm"
  | "ticket"
  | "time"
  | "timer"
  | "today"
  | "toggle"
  | "trail-sign"
  | "train"
  | "transgender"
  | "trash-bin"
  | "trash"
  | "trending-down"
  | "trending-up"
  | "triangle"
  | "trophy"
  | "tv"
  | "umbrella"
  | "unlink"
  | "videocam-off"
  | "videocam"
  | "volume-high"
  | "volume-low"
  | "volume-medium"
  | "volume-mute"
  | "volume-off"
  | "walk"
  | "wallet"
  | "warning"
  | "watch"
  | "water"
  | "wifi"
  | "wine"
  | "woman"
  | "logo-alipay"
  | "logo-amazon"
  | "logo-amplify"
  | "logo-android"
  | "logo-angular"
  | "logo-apple"
  | "logo-apple-appstore"
  | "logo-apple-ar"
  | "logo-behance"
  | "logo-bitbucket"
  | "logo-bitcoin"
  | "logo-buffer"
  | "logo-capacitor"
  | "logo-chrome"
  | "logo-closed-captioning"
  | "logo-codepen"
  | "logo-css3"
  | "logo-designernews"
  | "logo-deviantart"
  | "logo-discord"
  | "logo-docker"
  | "logo-dribbble"
  | "logo-dropbox"
  | "logo-edge"
  | "logo-electron"
  | "logo-euro"
  | "logo-facebook"
  | "logo-figma"
  | "logo-firebase"
  | "logo-firefox"
  | "logo-flickr"
  | "logo-foursquare"
  | "logo-github"
  | "logo-gitlab"
  | "logo-google"
  | "logo-google-playstore"
  | "logo-hackernews"
  | "logo-html5"
  | "logo-instagram"
  | "logo-ionic"
  | "logo-ionitron"
  | "logo-javascript"
  | "logo-laravel"
  | "logo-linkedin"
  | "logo-markdown"
  | "logo-mastodon"
  | "logo-medium"
  | "logo-microsoft"
  | "logo-no-smoking"
  | "logo-nodejs"
  | "logo-npm"
  | "logo-octocat"
  | "logo-paypal"
  | "logo-pinterest"
  | "logo-playstation"
  | "logo-pwa"
  | "logo-python"
  | "logo-react"
  | "logo-reddit"
  | "logo-rss"
  | "logo-sass"
  | "logo-skype"
  | "logo-slack"
  | "logo-snapchat"
  | "logo-soundcloud"
  | "logo-stackoverflow"
  | "logo-steam"
  | "logo-stencil"
  | "logo-tableau"
  | "logo-tiktok"
  | "logo-tumblr"
  | "logo-tux"
  | "logo-twitch"
  | "logo-twitter"
  | "logo-usd"
  | "logo-venmo"
  | "logo-vercel"
  | "logo-vimeo"
  | "logo-vk"
  | "logo-vue"
  | "logo-web-component"
  | "logo-wechat"
  | "logo-whatsapp"
  | "logo-windows"
  | "logo-wordpress"
  | "logo-xbox"
  | "logo-xing"
  | "logo-yahoo"
  | "logo-yen"
  | "logo-youtube";

export type GoABIconSize = "small" | "medium" | "large";
export type GoABIconTheme = "outline" | "filled";
export type GoABIconButtonVariant = "color" | "nocolor" | "dark" | "destructive";
export type GoABIconVariant = "primary" | "secondary" | "tertiary";

// Common

export type NumericSpacing =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10";

export type TShirtSpacing =
  | "none"
  | "3xs"
  | "2xs"
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export type Spacing = NumericSpacing | TShirtSpacing | null;

export interface Margins {
  mt?: Spacing;
  mr?: Spacing;
  mb?: Spacing;
  ml?: Spacing;
}

export type GoABBlockDirection = "row" | "column";
export type GoABBlockAlignment = "center" | "start" | "end";
