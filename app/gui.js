var app = angular.module('mak', []);

app.controller('mainEditorCtrl', ['$scope', '$sce', mainEditorCtrl]);
app.directive('previewIframe', previewIframe);

function mainEditorCtrl($scope, $sce) {
    $scope.editor = {
        context:  '',
        compiled: ''
    };

    $scope.preview = {
        styleElement: null,
        themes:       ['default', 'foghorn']
    };

    function init() {
        // Bind change event
        $scope.$watch('editor.context', function (newContext) {
            $scope.editor.compiled = $sce.trustAsHtml(mak.marked(newContext));
        });
        $scope.editor.context = '# hello, world';

        $scope.preview.styleElement      = document.createElement('link');
        $scope.preview.styleElement.rel  = 'stylesheet';
        $scope.preview.styleElement.type = 'text/css';

        loadTheme();
    }

    function loadTheme(theme) {
        $scope.preview.styleElement.href = './theme/' + (theme || 'default') + '.css';
    }

    init();
}

function previewIframe() {
    return {
        restrict: 'A',
        link:     function ($scope, element) {
            var document = element[0].contentDocument || element[0].contentWindow.document;
            document.head.appendChild($scope.preview.styleElement);

            $scope.$watch('editor.compiled', function (newCompiled) {
                document.body.innerHTML = newCompiled;
            });
        }
    }
}
