/**
 * Created by chad on 12/16/16.
 */

describe('Prop Parsing', function() {
    describe('${myProp}', function() {

        var result = DataBoundUtils.extractPropsFromString("${myProp}");

        it('should return ok value', function() {
            expect(result).to.be.ok;
        });

        it('should have 1 value', function () {
            expect(result).to.have.length(1) ;
        });

        it('should have field "prop" with "myProp" as value', function () {
            expect(result[0].prop).to.deep.equal("myProp");
        });

        it('should have field "match" with "${myProp}" as value', function () {
            expect(result[0].match).to.deep.equal("${myProp}");
        });
    });
});