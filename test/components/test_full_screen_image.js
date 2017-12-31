import { FullScreenImageComponentViewModel } from 'charactersheet/components/full-screen-image';
import Should from 'should';
import ko from 'knockout';

describe('Full screen image Component', function() {
    describe('Toggle full screen', function() {
        it('toggle the full screen status', function() {
            var params = {
                imageSource: ko.observable('www.image.com'),
                fullScreenStatus: ko.observable(false)
            };
            var vm = new FullScreenImageComponentViewModel(params);
            vm.imageSource().should.equal(params.imageSource());
            vm.fullScreenStatus().should.equal(false);
            vm.toggleFullScreen();
            vm.fullScreenStatus().should.equal(true);
        });
    });
});
