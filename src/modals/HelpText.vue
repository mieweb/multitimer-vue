<script setup lang="ts">
import ModalTemplate from '../components/ModalTemplate.vue';
// eslint-disable-next-line no-undef
const versionNumber = MULTITIMER_VERSION;
</script>
<template>
	<ModalTemplate
		:title="'Help'"
	>
		<h4>Creating a Timer</h4>
		Create a timer by clicking the
		<i class="fa fa-plus" /> button on the top-left corner of
		the screen, in the header bar. A prompt will appear with
		inputs for an issue ID, a title for the timer, and an
		initial time the timer will start at. If no time is given,
		the timer will start from 0.
		<hr>
		<h4>Interacting with the Timer</h4>
		The timer features a variety of controls, separated by what I consider
		timer options and extra controls.
    
		<h5>Timer Options</h5>
		These controls are featured on the "first row" of the timer. Describing those controls
		from left to right:
		<ul>
			<li>
				The <i class="fa fa-save" /> save button, when an
				issue is assigned to the timer, will open a window
				to the logging system for logging the time of the
				timer.
			</li>
			<li>
				The issue number may be clicked to bring up the
				issue in a new window.
			</li>
			<li>
				The <i class="fa fa-edit" /> edit button shows a
				prompt to change the issue and title of the timer.
			</li>
			<li>
				The <i class="fa fa-undo" /> reset button resets
				the timer back to zero and erases the comment after a prompt of
				confirmation.
			</li>
			<li>
				The <i class="fa fa-plus" /> update time button
				prompts you to add or subtract time from the timer.
			</li>
			<li>
				The <i class="fa fa-star" /> favorite button save the timer
				as a quick timer that can be created easily in the <i class="fa fa-ticket" />
				modal.
			</li>
			<li>
				The <i class="fa fa-trash-alt" /> delete button
				deletes the timer after a prompt.
			</li>
			<li>
				The <i class="fa fa-play" /> start button starts
				the timer. This button turns into the
				<i class="fa fa-pause" /> stop button once
				clicked, which stops the timer.
			</li>
			<li>
				The <i class="fa fa-chevron-up" />/<i class="fa fa-chevron-down" /> buttons
				toggle the display of the extra controls.
			</li>
			<li>
				The <i class="fa fa-grip-vertical" /> icon is used to drag the timer in the list. Click and hold your mouse over
				the icon to drag the timer through the list.
			</li>
			<li>
				The <i class="fa fa-retweet" /> icon switchs the right-adjacent dropdown between a billable dropdown and an activity dropdown
			</li>
		</ul>
		<h5>Extra Controls</h5>
		These controls are featured on the "second row" of the timer, and can be hidden with
		the <i class="fa fa-chevron-up" />/<i class="fa fa-chevron-down" /> toggle control.
		Describing these controls left to right:
		<ul>
			<li>
				Two dropdowns exist within this control, toggled with the <i class="fa fa-retweet" /> button:
				<ul>
					<li>
						The billable dropdown controls how the issue is billed on logging to Redmine.
					</li>
					<li>
						The activity dropdown controls the associated activity for the issue, which is filled out on Redmine.
					</li>
				</ul>
			</li>
			<li>
				The comment input box, type out a comment that gets filled out when logging to Redmine.
			</li>
			<li>
				The meeting link, if this timer is associated with a meeting, put the meeting link here to
				open the join link in a new link in the browser (which would take you to the meeting).
			</li>
		</ul>
		<hr>
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
				<div
					class="input-group-sm"
					style="display:inline-block"
				>
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
				<div
					class="input-group-sm"
					style="display:inline-block"
				>
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
				The <i class="fa fa-cog" /> settings button for
				the timer settings.
			</li>
			<li>
				The <i class="fa fa-ticket" /> common tickets
				button for common and custom ticket templates, for
				quickly creating tickets.
			</li>
			<li>
				The <i class="fa fa-question-circle" /> help
				button, which opens this modal!
			</li>
			<li>
				The <i class="fa fa-moon" /> color toggle
				button, which toggles between dark and light mode.
			</li>
		</ul>
		<hr>
		<h4>Quick Timers</h4>
		<p>
			Quick timers feature two lists of entries: <b>Common Timers</b> and <b>Favorite Timers</b>. Each list has a list of entries that
			can create a new timer by clicking on the text of said entry. The former section is a static list of predefined entries which
			cannot be modified. The latter can be added to and deleted from.
		</p>
		<p>
			To modify the list of <b>Favorite Timers</b>, click the <i class="fa fa-star" /> button on an existing timer. This
			copies over the issue number and the title of the timer the button belongs to, and a new timer can be created with that data when
			you click on related entry in the list. To remove the entry, click the <i class="fa fa-trash-alt" /> button next to entry you
			want deleted.
		</p>
		<hr>
		<h4>Timer Save Data</h4>
		<p>
			Currently, all save data is relegated to your browser's <i>localStorage</i>, meaning that changing
			to a different browser or a different device will result in you having no timers. Since save data is not loaded
			onto another server (at the moment (?)), a work around is exporting your data.
		</p>
		<p>
			At the bottom of the <i class="fa fa-cog" /> settings page, a collection of buttons represent the <i>Import/Exporting</i>
			section. Simply click the <span class="text-primary">Export Save Data</span> button to save a JSON file to your PC,
			and you can distribute that to another session and import all your data with <span class="text-success">Import Save Data</span>.
		</p>	
		<p>
			Do not assume that this save data will always be compatible with MultiTimer. If an update gets pushed in the time
			it takes to import that file, it may potentially fail.
		</p>
		<p>
			In the event that you magically have lost all your save data on the same browser and device (probably due to an update), click
			the <span class="text-primary">Recover Save Data</span> button to attempt to recover this data. This recovery process will attempt
			to account for the previous version's save data shape and recreate your previous session.
		</p>
		<hr>
		<h4>Importing Meetings as Timers</h4>
		<p>
			A stellar feature is the ability to take meetings from Outlook and import
			them as timers.
		</p>
		<p>
			The feature has you login to Outlook, consent to permissions, and then detects
			meetings for the current day. Any meetings detected will be presented in a modal
			where you can look and edit them as you please before creating the timers.
		</p>
		<p>
			The only requirement to detect a meeting capable of creating a timer is
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
		<p>
			If you want to view all your meetings (and events) from your calendar instead of just the ones that have a
			issue number attached to it, you can go to the settings and uncheck the checkbox with the label
			"Only import meetings with a detectable issue number". This will show all your meetings in the configured
			range.
		</p>
		The instructions to create timers from today's meetings are:
		<ul>
			<li>
				Click the <b>Get Meetings from Outlook</b> button. If you haven't logged in prior, you
				will be prompted to login and consent. This should be a one-time process.
			</li>
			<li>Wait for the data to load into the modal.</li>
			<li>
				Once it has loaded, and you have detectable meetings, a list of meetings should be
				presented with prefilled fields with an issue number, timer title, and time for the meeting.
				You can edit any of these fields if you so desire.
			</li>
			<li>
				Click any of the checkboxes associated with the form data you want to use to create new Timers.
				Once you have made your selection, click the <b>Create Timer(s)</b> button.
			</li>
			<li>Your new timers should be completed. Great!</li>
		</ul>
		<hr>
		<h4>About The MultiTimer ⏱️</h4>
		<h6 class="text-muted">
			Version: {{ versionNumber }}
		</h6>
		<h6 class="text-muted">
			Author: Thomas Baugher
		</h6>
		<h6 class="text-muted">
			<a
				class="link-secondary"
				href="https://github.mieweb.com/tbaugher/multitimer-vue"
				target="_blank"
				rel="noreferrer noopener"
			>Repo</a>
			and
			<a
				class="link-primary"
				href="https://github.mieweb.com/tbaugher/multitimer-vue/issues"
				target="_blank"
				rel="noreferrer noopener"
			>Issues</a>
		</h6>
	</ModalTemplate>
</template>