<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
</script>
<template>
    <ModalTemplate :modalId="'help-modal'" :title="'Help'">
        <h4>Creating a Timer</h4>
        Create a timer by clicking the
        <i class="fa fa-plus"></i> button on the top-left corner of
        the screen, in the header bar. A prompt will appear with
        inputs for an issue ID, a title for the timer, and an
        initial time the timer will start at. If no time is given,
        the timer will start from 0.
        <hr />
        <h4>Interacting with the Timer</h4>
        The timer features a variety of controls, separated by what I consider
        timer options and extra controls.
    
        <h5>Timer Options</h5>
        These controls are featured on the "first row" of the timer. Describing those controls
        from left to right:
        <ul>
            <li>
                The <i class="fa fa-save"></i> save button, when an
                issue is assigned to the timer, will open a window
                to the logging system for logging the time of the
                timer.
            </li>
            <li>
                The issue number may be clicked to bring up the
                issue in a new window.
            </li>
            <li>
                The <i class="fa fa-edit"></i> edit button shows a
                prompt to change the issue and title of the timer.
            </li>
            <li>
                The <i class="fa fa-undo"></i> reset button resets
                the timer back to zero after a prompt of
                confirmation.
            </li>
            <li>
                The <i class="fa fa-plus"></i> update time button
                prompts you to add or subtract time from the timer.
            </li>
            <li>
                The <i class="fa fa-star"></i> favorite button save the timer
                as a quick timer that can be created easily in the <i class="fa fa-ticket"></i>
                modal.
            </li>
            <li>
                The <i class="fa fa-trash-alt"></i> delete button
                deletes the timer after a prompt.
            </li>
            <li>
                The <i class="fa fa-play"></i> start button starts
                the timer. This button turns into the
                <i class="fa fa-pause"></i> stop button once
                clicked, which stops the timer.
            </li>
            <li>
                The <i class="fa fa-chevron-up"></i>/<i class="fa fa-chevron-down"></i> buttons
                toggle the display of the extra controls.
            </li>
        </ul>
        <h5>Extra Controls</h5>
        These controls are featured on the "second row" of the timer, and can be hidden with
        the <i class="fa fa-chevron-up"></i>/<i class="fa fa-chevron-down"></i> toggle control.
        Describing these controls left to right:
        <ul>
            <li>
                Considered the bill status dropdown, can select how this timer is billed when you log
                it to Redmine.
            </li>
            <li>
                The comment input box, type out a comment that gets filled out when logging to Redmine.
            </li>
            <li>
                The meeting link, if this timer is associated with a meeting, put the meeting link here to
                open the join link in a new link in the browser (which would take you to the meeting).
            </li>
        </ul>
        <hr />
        <h4>Top Controls</h4>
        Above the timer list, are the top controls, which are mostly self-explantory. The features include:
        <ul>
            <li>
                <span class="text-primary">Log All Timers</span> will log all the timers that have time; timers with no time will be excluded.
                This features includes a date selector which will affect the log date, which defaults to the current date upon refresh of the site.
            </li>
            <li>
                <span class="text-danger">Reset All Timers</span> will reset all timers with time back to zero.
            </li>
            <li>
                <span class="text-danger">Delete All Timers</span> will delete all timers, clearing your timer list.
            </li>
            <li>
                A search bar labeled 
                <div class="input-group-sm" style="display:inline-block">
                    <div class="input-group-text">
                        Search timers:
                    </div>
                </div>
                allows searching from the current list of timers that exist in your timer list based on the title
                of your timer. You can search any part of the title to get your results (i.e. a query of 'f' will return all timers with an 'f' in it),
                and capitalization is not taken into consideration.
            </li>
            <li>
                The checkbox labeled with 
                <div class="input-group-sm" style="display:inline-block">
                    <div class="input-group-text">
                        Timers with time
                    </div>
                </div>
                will filter out any timers with no time on them. This can be useful when logging 😉.
            </li>
        </ul>
        <h4>Top Right Controls</h4>
        The other controls in the top-right corner:
        <ul>
            <li>
                The <i class="fa fa-cog"></i> settings button for
                the timer settings.
            </li>
            <li>
                The <i class="fa fa-ticket"></i> common tickets
                button for common and custom ticket templates, for
                quickly creating tickets.
            </li>
            <li>
                The <i class="fa fa-question-circle"></i> help
                button, which opens this modal!
            </li>
            <li>
                The <i class="fa fa-moon"></i> color toggle
                button, which toggles between dark and light mode.
            </li>
        </ul>
        <hr>
        <h4>Importing Meetings as Timers</h4>
        <p>A stellar feature is the ability to take meetings from Outlook and import
        them as timers.</p>
        <p>The feature has you login to Outlook, consent to permissions, and then detects
            meetings for the current day. Any meetings detected will be presented in a modal
        where you can look and edit them as you please before creating the timers.</p>
        <p>The only requirement to detect a meeting capable of creating a timer is
            for the issue number to be present in the subject field of the meeting. If it is <b>not</b>
            present, the meeting will not be detected, and won't show up in the list to create a new timer.
        </p>
        <p>
            Meetings can be detected with four preset detection ranges. You can detect meetings on:
            <ul>
                <li>...the current day.</li>
                <li>...the current week.</li>
                <li>...the current month.</li>
                <li>...a range of two dates of your choosing.</li>
            </ul>
            By default, the preset is set on the current day. The range defaults to the day you first access this feature. When setting the range,
            it requires that the first "from" date is takes place before the
            second "to" date, otherwise will revert back to its initial set range.
        </p>
        The instructions to create timers from today's meetings are:
        <ul>
            <li>Click the <b>Get Meetings from Outlook</b> button. If you haven't logged in prior, you
            will be prompted to login and consent. This should be a one-time process.</li>
            <li>Wait for the data to load into the modal.</li>
            <li>Once it has loaded, and you have detectable meetings, a list of meetings should be
                presented with prefilled fields with an issue number, timer title, and time for the meeting.
                You can edit any of these fields if you so desire.
            </li>
            <li>
                Click any of the checkboxes associated with the form data you want to use to create new Timers.
                Once you have made your selection, click the <b>Create Timer(s)</b> button.
            </li>
            <li>Your new timers should be completed. Great!</li>
        </ul>
    </ModalTemplate>
</template>
<script lang="ts">export default {};</script>