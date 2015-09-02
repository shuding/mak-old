/**
 * Created by shuding on 9/1/15.
 * <ds303077135@gmail.com>
 */

var marked    = require('marked');
var katex     = require('katex');
var highlight = require('highlight.js');

var katexRender = new marked.Renderer();

katexRender.paragraph = function (text) {
    // TODO
    var texRegExp = /\$([^\$]+?)\$/g;

    text = text.replace(texRegExp, function (wrap, match) {
        var ret = match;
        try {
            ret = katex.renderToString(match);
        } catch (err) {
            ret = match;
        }
        return ret;
    });

    return '<p>' + text + '</p>';
};

marked.setOptions({
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
    },
    renderer:  katexRender
});

module.exports = {
    marked: marked
};
