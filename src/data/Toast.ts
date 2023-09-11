export enum ToastType {
	Success,
	Failure,
	Warning,
	Info
}

export function showToast(title: string, content: string, type = ToastType.Info) {
	const { headerClass, bodyClass, icon } = toastClasses(type);
	const ce = new CustomEvent('showToast', { detail: { title, content, headerClass, bodyClass, icon }});
	document.dispatchEvent(ce);
}

function toastClasses(type: ToastType) {
	const classes = {
		headerClass: 'bg-light',
		bodyClass: 'bg-light-subtle',
		icon: 'fa-circle-info'
	};

	switch(type) {
	case ToastType.Success:
		classes.headerClass = 'bg-success';
		classes.bodyClass = 'bg-success-subtle';
		classes.icon = 'fa-check';
		break;
	case ToastType.Failure:	
		classes.headerClass = 'bg-danger';
		classes.bodyClass = 'bg-danger-subtle';
		classes.icon = 'fa-xmark';
		break;
	case ToastType.Warning:
		classes.headerClass = 'bg-warning';
		classes.bodyClass = 'bg-warning-subtle';
		classes.icon = 'fa-exclamation';
		break;
	}

	return classes;
}