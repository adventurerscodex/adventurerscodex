import { PlusMinusComponentViewModel } from 'charactersheet/components/plus-minus'

describe('Plus-Minus Component', function() {
    describe('Increase', function() {
        it('should increase the value up to a threshold', function() {
            var params = {
                value: ko.observable(4),
                max: ko.observable(12),
                min: ko.observable(0)
            };
            var vm = new PlusMinusComponentViewModel(params);
            for (var i = 0; i < 12; i++) {
                vm.increase();
            }
            vm.value().should.equal(params.max());
        });
    });

    describe('Decrease', function() {
        it('should decrease the value up to a threshold', function() {
            var params = {
                value: ko.observable(4),
                max: ko.observable(12),
                min: ko.observable(0)
            };
            var vm = new PlusMinusComponentViewModel(params);

            for (var j = 0; j < 15; j++) {
                vm.decrease();
            }
            vm.value().should.equal(params.min());
        });
    });

    describe('No Min/Max', function() {
        it('should use the default parameters', function() {
            var params = {
                value: ko.observable(4)
            };
            var vm = new PlusMinusComponentViewModel(params);

            vm.min().should.equal(0);
            vm.max().should.equal(1000000);
        });
    });
});
