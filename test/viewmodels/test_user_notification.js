import simple from 'simple-mock';
import toastr from 'toastr';

import { UserNotificationViewModel } from 'charactersheet/viewmodels/common';

describe('UserNotificationViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });
    describe('Add Info Notification', function() {
        it('should dispatch an info notification to toastr', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            var toastrSpy = simple.mock(toastr, 'info');

            userNotificationViewModel.addInfoNotification('testing', 'title');

            toastrSpy.called.should.equal(true);
        });
    });

    describe('Add Success Notification', function() {
        it('should dispatch an info notification to toastr', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            var toastrSpy = simple.mock(toastr, 'success');

            userNotificationViewModel.addSuccessNotification('testing', 'title');

            toastrSpy.called.should.equal(true);
        });
    });

    describe('Add Warning Notification', function() {
        it('should dispatch an info notification to toastr', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            var toastrSpy = simple.mock(toastr, 'warning');

            userNotificationViewModel.addWarningNotification('testing', 'title');

            toastrSpy.called.should.equal(true);
        });
    });

    describe('Add Danger Notification', function() {
        it('should dispatch an info notification to toastr', function() {
            var userNotificationViewModel = new UserNotificationViewModel();
            var toastrSpy = simple.mock(toastr, 'error');

            userNotificationViewModel.addDangerNotification('testing', 'title');

            toastrSpy.called.should.equal(true);
        });
    });
});
